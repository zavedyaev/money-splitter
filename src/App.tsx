import React from 'react';
import {Translation, withTranslation, WithTranslation} from 'react-i18next';
import {Family, Man, OptimizedTransactions, Spending, Summary, SummaryRowFamily, SummaryRowMan} from "./Models";
import PeopleComponent from "./PeopleComponent";
import {v4 as uuidv4} from 'uuid';
import FamiliesComponent from "./FamiliesComponent";
import SpendingsComponent from "./SpendingsComponent";
import SummaryComponent from "./SummaryComponent";
import {Helpers} from "./Helpers";
import TransactionsComponent from "./TransactionsComponent";

export class App extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props);
        document.title = this.props.t("description.title") + " - " + this.props.t("zavedyaev")
        this.state = {
            showTips: true,
            people: [],
            families: [],
            spendings: [],
            enableFamilies: false,
            focusOnNewMan: true,
            focusOnNewFamily: false,
            focusOnNewSpending: false
        }
    }

    render() {
        let peopleNotInFamilies = this.peopleNotInFamilies()
        return (
            <Translation>{t =>
                <div>
                    <nav className="navbar navbar-expand-lg navbar-light bg-light">
                        <div className="container">
                            <a className="navbar-brand" href="http://zavedyaev.ru">
                                <img alt="icon" className="d-inline-block align-top" height="30" loading="lazy"
                                     src={process.env.PUBLIC_URL + '/favicon.png'}
                                     width="30"/>
                                &nbsp;{t('zavedyaev')}
                            </a>
                            <button className="navbar-toggler" type="button" data-toggle="collapse"
                                    data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent"
                                    aria-expanded="false" aria-label="Toggle navigation">
                                <span className="navbar-toggler-icon"/>
                            </button>

                            <div className="collapse navbar-collapse" id="navbarSupportedContent">
                                <ul className="navbar-nav mr-auto">
                                    <li className="nav-item">
                                        <button className="btn nav-link" onClick={() => this.reset()}>
                                            {t('nav.reset')}
                                        </button>
                                    </li>
                                    <li className="nav-item">
                                        <button className="btn nav-link" onClick={() => this.toggleShowTips()}>
                                            {this.state.showTips ? t('nav.hideTips') : t('nav.showTips')}
                                        </button>
                                    </li>
                                    <li className="nav-item">
                                        <button className="btn nav-link" onClick={() => this.showExample()}>
                                            {t('nav.showExample')}
                                        </button>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </nav>

                    <div className="container">
                        <h1>{t('description.title')}</h1>
                        <p>{t('description.value')}</p>
                        <PeopleComponent people={this.state.people} updateName={this.updateManName} addMan={this.addMan}
                                         removeMan={this.removeMan} focusOnNewItem={this.state.focusOnNewMan}
                                         showTips={this.state.showTips}
                        />

                        {!this.showSpendings() ? "" :
                            <SpendingsComponent people={this.state.people} spendings={this.state.spendings}
                                                updateSpendingName={this.updateSpendingName}
                                                removeSpending={this.removeSpending} addSpending={this.addSpending}
                                                updateSpendingPrice={this.updateSpendingPrice}
                                                updatePayedBy={this.updatePayedBy} updateUsedBy={this.updateUsedBy}
                                                focusOnNewItem={this.state.focusOnNewSpending}
                                                showTips={this.state.showTips}
                            />
                        }

                        {!this.showFamilies() ? "" :
                            <div>
                                <div className="form-check">
                                    <input className="form-check-input" type="checkbox" id="enableFamilies"
                                           checked={this.state.enableFamilies}
                                           onChange={() => this.toggleEnableFamilies()}/>
                                    <label className="form-check-label" htmlFor="enableFamilies">
                                        {t('families.enable')}
                                    </label>
                                </div>
                                {!this.state.enableFamilies ? "" :
                                    <FamiliesComponent people={this.state.people} signlePeople={peopleNotInFamilies}
                                                       families={this.state.families}
                                                       addFamily={this.addFamily} removeFamily={this.removeFamily}
                                                       updateFamilyName={this.updateFamilyName}
                                                       addMan={this.addManToFamily}
                                                       removeMan={this.removeManFromFamily}
                                                       focusOnNewItem={this.state.focusOnNewFamily}
                                                       showTips={this.state.showTips}
                                    />
                                }
                            </div>
                        }

                        {!this.showSummary() ? "" :
                            <div>
                                <SummaryComponent people={this.state.people} enableFamilies={this.state.enableFamilies}
                                                  families={this.state.families} summary={this.summary()}
                                                  showTips={this.state.showTips}
                                />

                                <TransactionsComponent transactions={this.optimizedTransactions(this.summary())}
                                                       enableFamilies={this.state.enableFamilies}
                                                       showTips={this.state.showTips}
                                />
                            </div>
                        }
                    </div>
                </div>
            }</Translation>
        );
    }

    toggleShowTips = () => {
        this.setState({showTips: !this.state.showTips})
    }

    reset = () => {
        this.setState({
            people: [],
            families: [],
            spendings: [],
            enableFamilies: false
        })
    }

    showExample = () => {
        this.setState({
            showTips: true,
            people: JSON.parse(this.props.t('example.people')),
            families: JSON.parse(this.props.t('example.families')),
            spendings: JSON.parse(this.props.t('example.spendings')),

            enableFamilies: true
        })
    }

    showSpendings = () => {
        return this.state.people.length > 2 ||
            (this.state.people.length === 2 && this.state.people.every(man => man.name.length > 0))
    }

    showFamilies = () => {
        return this.state.spendings.length > 1 ||
            (this.state.spendings.length === 1 && this.state.spendings[0].users.length > 0 &&
                this.state.spendings[0].payedBy.length > 0 && this.state.spendings[0].spent > 0)
    }

    showSummary = () => {
        return (!this.state.enableFamilies ||
            this.state.families.filter(family => family.members.length > 0).every(family => family.name.length > 0)) &&
            this.state.spendings.length > 0 && this.state.spendings.every(spending => {
                return spending.spent > 0 && spending.payedBy.length > 0 && spending.users.length > 0
            })
    }

    addMan = () => {
        let newMan = {
            id: uuidv4(),
            name: ""
        }
        let updatedPeople = [...this.state.people]
        updatedPeople.push(newMan)
        this.setState({
            people: updatedPeople,
            focusOnNewMan: true,
            focusOnNewFamily: false,
            focusOnNewSpending: false
        })
    }

    updateManName = (id: string, newName: string) => {
        let updatedMan = {
            id: id,
            name: newName
        } as Man

        let oldMan = this.state.people.find(value => value.id === id)!!
        let oldIndex = this.state.people.indexOf(oldMan)
        let updatedPeople = [...this.state.people]
        updatedPeople[oldIndex] = updatedMan
        this.setState({people: updatedPeople})
    }

    removeMan = (man: Man) => {
        let oldIndex = this.state.people.indexOf(man)
        let updatedPeople = [...this.state.people]
        updatedPeople.splice(oldIndex, 1)

        let updatedFamilies = [...this.state.families]
        this.state.families.forEach((family, familyIndex) => {
            let manIndex = family.members.indexOf(man.id)
            if (manIndex >= 0) {
                let updatedFamily = {...family};
                let updatedMembers = [...updatedFamily.members]
                updatedMembers.splice(manIndex, 1)
                updatedFamily.members = updatedMembers
                updatedFamilies[familyIndex] = updatedFamily
            }
        })

        let updatedSpendings = [...this.state.spendings]
        this.state.spendings.forEach((spending, spendingIndex) => {
            let updatedSpending = {...spending};

            let payedByIndex = spending.payedBy.indexOf(man.id)
            if (payedByIndex >= 0) {
                let updatedMembers = [...updatedSpending.payedBy]
                updatedMembers.splice(payedByIndex, 1)
                updatedSpending.payedBy = updatedMembers
            }

            let userIndex = spending.users.indexOf(man.id)
            if (userIndex >= 0) {
                let updatedMembers = [...updatedSpending.users]
                updatedMembers.splice(userIndex, 1)
                updatedSpending.users = updatedMembers
            }

            updatedSpendings[spendingIndex] = updatedSpending
        })

        this.setState({people: updatedPeople, families: updatedFamilies, spendings: updatedSpendings})
    }

    toggleEnableFamilies = () => {
        this.setState({enableFamilies: !this.state.enableFamilies})
    }

    peopleNotInFamilies = () => {
        let allPeople = this.state.people
        let peopleInFamilyIds = this.state.families.flatMap(value => value.members)
        return allPeople.filter(value => !peopleInFamilyIds.includes(value.id))
    }

    addFamily = () => {
        let newFamily = {
            id: uuidv4(),
            name: "",
            members: []
        }
        let updatedFamilies = [...this.state.families]
        updatedFamilies.push(newFamily)
        this.setState({
            families: updatedFamilies,
            focusOnNewMan: false,
            focusOnNewFamily: true,
            focusOnNewSpending: false
        })
        return newFamily.id
    }

    updateFamilyName = (id: string, newName: string) => {
        let oldFamily = this.state.families.find(value => value.id === id)!!
        let updatedFamily = {
            id: id,
            name: newName,
            members: oldFamily.members
        } as Family


        let oldIndex = this.state.families.indexOf(oldFamily)
        let updatedFamilies = [...this.state.families]
        updatedFamilies[oldIndex] = updatedFamily
        this.setState({families: updatedFamilies})
    }

    removeFamily = (family: Family) => {
        let oldIndex = this.state.families.indexOf(family)
        let updatedFamilies = [...this.state.families]
        updatedFamilies.splice(oldIndex, 1)
        this.setState({families: updatedFamilies})
    }

    addManToFamily = (family: Family, man: Man) => {
        let updatedFamily = {
            id: family.id,
            name: family.name,
            members: [...family.members, man.id]
        }
        let index = this.state.families.indexOf(family);

        let updatedFamilies = [...this.state.families]
        updatedFamilies[index] = updatedFamily
        this.setState({families: updatedFamilies})
    }

    removeManFromFamily = (family: Family, manId: string) => {
        let updatedMembers = family.members.filter(value => value !== manId)
        let updatedFamily = {
            id: family.id,
            name: family.name,
            members: updatedMembers
        }
        let index = this.state.families.indexOf(family);
        let updatedFamilies = [...this.state.families]
        updatedFamilies[index] = updatedFamily
        this.setState({families: updatedFamilies})
    }

    addSpending = () => {
        let newSpending = {
            id: uuidv4(),
            name: "",
            spent: 0,
            payedBy: [],
            users: []
        }
        let updatedSpendings = [...this.state.spendings, newSpending]
        this.setState({
            spendings: updatedSpendings,
            focusOnNewMan: false,
            focusOnNewFamily: false,
            focusOnNewSpending: true
        })
    }

    removeSpending = (spending: Spending) => {
        let oldIndex = this.state.spendings.indexOf(spending)
        let updatedSpendings = [...this.state.spendings]
        updatedSpendings.splice(oldIndex, 1)
        this.setState({spendings: updatedSpendings})
    }

    updateSpendingName = (spending: Spending, newName: string) => {
        let updatedSpending = {...spending, name: newName}

        let index = this.state.spendings.indexOf(spending);
        let updatedSpendings = [...this.state.spendings]
        updatedSpendings[index] = updatedSpending
        this.setState({spendings: updatedSpendings})
    }

    updateSpendingPrice = (spending: Spending, newPrice: number) => {
        let updatedSpending = {...spending, spent: newPrice}

        let index = this.state.spendings.indexOf(spending);
        let updatedSpendings = [...this.state.spendings]
        updatedSpendings[index] = updatedSpending
        this.setState({spendings: updatedSpendings})
    }

    updatePayedBy = (spending: Spending, payedBy: Man[]) => {
        let updatedSpending = {...spending, payedBy: payedBy.map(value => value.id)}

        let index = this.state.spendings.indexOf(spending);
        let updatedSpendings = [...this.state.spendings]
        updatedSpendings[index] = updatedSpending
        this.setState({spendings: updatedSpendings})
    }

    updateUsedBy = (spending: Spending, usedBy: Man[]) => {
        let updatedSpending = {...spending, users: usedBy.map(value => value.id)}

        let index = this.state.spendings.indexOf(spending);
        let updatedSpendings = [...this.state.spendings]
        updatedSpendings[index] = updatedSpending
        this.setState({spendings: updatedSpendings})
    }

    summary = () => {
        let summaryRowsForPeople: SummaryRowMan[] = this.state.people.map(man => ({
            manId: man.id,
            paid: 0,
            used: 0,
            difference: 0

        }));
        this.state.spendings.forEach(spending => {
            let payedByMan = spending.spent / spending.payedBy.length
            let spentByMan = spending.spent / spending.users.length

            spending.payedBy.forEach(manId => {
                let payedMan = summaryRowsForPeople.find(it => it.manId === manId)
                payedMan!!.paid += payedByMan
                payedMan!!.difference += payedByMan
            })

            spending.users.forEach(manId => {
                let user = summaryRowsForPeople.find(it => it.manId === manId)
                user!!.used += spentByMan
                user!!.difference -= spentByMan
            })
        })

        let rows: (SummaryRowMan | SummaryRowFamily)[] = [];

        if (this.state.enableFamilies) {
            let validFamilies = this.state.families.filter(family => family.members.length > 0)

            let summaryRowsForFamilies: SummaryRowFamily[] = validFamilies.map(family => {
                let paid = 0
                let used = 0
                let summaryForMembers: SummaryRowMan[] = []
                family.members.forEach(manId => {
                    let summary = summaryRowsForPeople.find(summaryForMan => summaryForMan.manId === manId)!!
                    paid += summary.paid
                    used += summary.used
                    summaryForMembers.push(summary)
                    summaryRowsForPeople.splice(summaryRowsForPeople.indexOf(summary), 1)
                })
                return {
                    familyId: family.id,
                    paid: paid,
                    used: used,
                    difference: paid - used,
                    summaryForMembers: summaryForMembers
                }
            });
            summaryRowsForFamilies.forEach(row => rows.push(row))
        }
        summaryRowsForPeople.forEach(row => rows.push(row))

        return {
            rows: rows
        } as Summary
    }

    optimizedTransactions = (summary: Summary) => {
        let rowsWithDebts: (SummaryRowMan | SummaryRowFamily)[] = summary.rows.filter(row => !Helpers.zero(row.difference)).map(row => ({...row}))
        let result = [] as OptimizedTransactions[];
        while (rowsWithDebts.length > 0) {
            rowsWithDebts.sort((a, b) => {
                return b.difference - a.difference
            })
            let maxCreditor = rowsWithDebts[0];
            let maxDebtor = rowsWithDebts[rowsWithDebts.length - 1];

            let sum;
            if (maxCreditor.difference > -(maxDebtor.difference)) {
                sum = -(maxDebtor.difference);
                rowsWithDebts.splice(rowsWithDebts.length - 1, 1);

                let newDifference = maxCreditor.difference - sum;
                if (Helpers.zero(newDifference)) {
                    rowsWithDebts.splice(0, 1);
                } else {
                    maxCreditor.difference = newDifference
                }
            } else {
                sum = maxCreditor.difference;
                rowsWithDebts.splice(0, 1);
                let newDifference = maxDebtor.difference + sum;
                if (Helpers.zero(Math.abs(newDifference))) {
                    rowsWithDebts.splice(rowsWithDebts.length - 1, 1);
                } else {
                    maxDebtor.difference = newDifference
                }
            }

            rowsWithDebts = rowsWithDebts.filter(row => !Helpers.zero(row.difference));

            result.push({
                debtorManOrFamilyName: "familyId" in maxDebtor ? this.nameByFamilyId(maxDebtor.familyId) : this.nameByManId(maxDebtor.manId),
                creditorManOrFamilyName: "familyId" in maxCreditor ? this.nameByFamilyId(maxCreditor.familyId) : this.nameByManId(maxCreditor.manId),
                debt: sum
            } as OptimizedTransactions)
        }

        return result;
    }

    nameByFamilyId = (familyId: string) => {
        return this.state.families.find(family => family.id === familyId)!!.name
    }
    nameByManId = (manId: string) => {
        return this.state.people.find(man => man.id === manId)!!.name
    }
}

interface Props extends WithTranslation {
}

interface State {
    showTips: boolean;
    people: Man[];
    families: Family[];
    spendings: Spending[];
    enableFamilies: boolean;
    focusOnNewMan: boolean;
    focusOnNewFamily: boolean;
    focusOnNewSpending: boolean;
}

export default withTranslation()(App)
