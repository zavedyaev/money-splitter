import React from 'react';
import {Translation, withTranslation, WithTranslation} from 'react-i18next';
import {Family, Man, OptimizedTransactions, Spending, Summary, SummaryRowFamily, SummaryRowMan} from "./Models";
import PeopleComponent from "./PeopleComponent";
import ToastComponent from "./ToastComponent";
import {v4 as uuidv4} from 'uuid';
import FamiliesComponent from "./FamiliesComponent";
import SpendingsComponent from "./SpendingsComponent";
import SummaryComponent from "./SummaryComponent";
import {Helpers} from "./Helpers";
import TransactionsComponent from "./TransactionsComponent";
import $ from "jquery";

export class App extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props);
        const id = Helpers.getQueryVariable("id");

        document.title = this.props.t("description.title") + " - " + this.props.t("zavedyaev")
        this.state = {
            id: (!id) ? undefined : id,
            loading: !!id,
            previousId: undefined,
            saving: false,
            savedId: undefined,
            errorMessages: [],
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
        const peopleNotInFamilies = this.peopleNotInFamilies()
        return (
            <Translation>{t =>
                <div>
                    <ToastComponent errorMessages={this.state.errorMessages}/>

                    <nav className="navbar navbar-expand-lg navbar-light bg-light">
                        <div className="container">
                            <a className="navbar-brand" href="https://zavedyaev.ru">
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

                        {this.state.loading ?
                            <div className="text-center">
                                <div className="spinner-border text-primary" role="status">
                                    <span className="sr-only">{t('nav.loading')}</span>
                                </div>
                            </div>
                            :
                            <div>
                                <PeopleComponent people={this.state.people} updateName={this.updateManName}
                                                 addMan={this.addMan}
                                                 removeMan={this.removeMan} focusOnNewItem={this.state.focusOnNewMan}
                                                 showTips={this.state.showTips}
                                />

                                {!this.showSpendings() ? "" :
                                    <SpendingsComponent people={this.state.people} spendings={this.state.spendings}
                                                        updateSpendingName={this.updateSpendingName}
                                                        removeSpending={this.removeSpending}
                                                        addSpending={this.addSpending}
                                                        updateSpendingPrice={this.updateSpendingPrice}
                                                        updatePayedBy={this.updatePayedBy}
                                                        updateUsedBy={this.updateUsedBy}
                                                        focusOnNewItem={this.state.focusOnNewSpending}
                                                        showTips={this.state.showTips}
                                    />
                                }

                                {!this.showFamilies() ? "" :
                                    <div>
                                        <div className="form-check mt-2 mb-2">
                                            <input className="form-check-input" type="checkbox" id="enableFamilies"
                                                   checked={this.state.enableFamilies}
                                                   onChange={() => this.toggleEnableFamilies()}/>
                                            <label className="form-check-label" htmlFor="enableFamilies">
                                                {t('families.enable')}
                                            </label>
                                        </div>
                                        {!this.state.enableFamilies ? "" :
                                            <FamiliesComponent people={this.state.people}
                                                               signlePeople={peopleNotInFamilies}
                                                               families={this.state.families}
                                                               addFamily={this.addFamily}
                                                               removeFamily={this.removeFamily}
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
                                        <SummaryComponent people={this.state.people}
                                                          enableFamilies={this.state.enableFamilies}
                                                          families={this.state.families} summary={this.summary()}
                                                          showTips={this.state.showTips}
                                        />

                                        <TransactionsComponent transactions={this.optimizedTransactions(this.summary())}
                                                               enableFamilies={this.state.enableFamilies}
                                                               showTips={this.state.showTips}
                                        />

                                        <form onSubmit={e => {
                                            e.preventDefault()
                                        }}>
                                            <button className="btn btn-primary" disabled={this.state.saving}
                                                    onClick={() => this.save()}>
                                                <span className="spinner-border spinner-border-sm mr-1" role="status"
                                                      hidden={!this.state.saving}
                                                      aria-hidden="true"/>
                                                {this.state.saving ? t('calls.saving') : t('calls.save')}
                                            </button>

                                            <div className="form-group mt-2">
                                                <label
                                                    hidden={!this.state.savedId}
                                                    htmlFor="savedUrlInput">
                                                    {t('calls.savedCalculationUrl')}
                                                </label>
                                                <input type="url" className="form-control" id="savedUrlInput"
                                                       hidden={!this.state.savedId}
                                                       value={this.getSavedUrl()}
                                                       onFocus={event => event.target.select()}
                                                       readOnly={true}
                                                />
                                            </div>
                                        </form>
                                    </div>
                                }
                            </div>
                        }
                    </div>
                </div>
            }</Translation>
        );
    }

    componentDidMount() {
        if (this.state.loading) {
            const serverUrl = this.getServerUrl()
            fetch(serverUrl + "/" + this.state.id, {method: 'GET'}).then(response => {
                if (!response.ok) {
                    throw response
                }
                return response.json()
            }).then(json => {
                const people = json.people
                const families = json.families
                const spendings = json.spendings
                const previousId = json.previousId

                this.setState({
                    loading: false,
                    people: people ? people : [],
                    families: families ? families : [],
                    enableFamilies: !!families,
                    spendings: spendings ? spendings : [],
                    previousId: previousId
                })
            }).catch(() => {
                this.setState({loading: false})
                this.reset()
                this.showError(this.props.t('calls.loadingError'))
            })
        }
    }

    getServerUrl = () => {
        const protocol = "https:"
        //for local run replace by
        //let protocol = window.location.protocol
        return protocol + "//" + window.location.hostname + ":8081/calculation"
    }

    save = () => {
        this.setState({saving: true}, () => {
            const dataToSave = {
                people: this.state.people,
                families: this.state.enableFamilies ? this.state.families : [],
                spendings: this.state.spendings,
                previousId: this.state.id
            }

            const serverUrl = this.getServerUrl()
            fetch(serverUrl, {
                method: 'POST',
                body: JSON.stringify(dataToSave),
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then(response => {
                if (!response.ok) {
                    throw response
                }
                return response.text()
            }).then(id => {
                this.setState({
                    saving: false,
                    savedId: id,
                    previousId: this.state.id,
                    id: id
                })
            }).catch(() => {
                this.setState({saving: false})
                this.showError(this.props.t('calls.savingError'))
            })
        })
    }

    getSavedUrl = () => {
        if (this.state.savedId) {
            return window.location.origin + window.location.pathname + "?id=" + this.state.savedId
        } else {
            return ""
        }
    }

    showError = (errorMessage: string) => {
        const newErrorMessages = [...this.state.errorMessages, errorMessage]
        this.setState({errorMessages: newErrorMessages}, () => {
            $(".toast").toast("show")
        })
        setTimeout(() => {
            const withoutError = [...this.state.errorMessages].filter(it => it !== errorMessage)
            this.setState({errorMessages: withoutError})
        }, 10000);
    }

    toggleShowTips = () => {
        this.setState({showTips: !this.state.showTips})
    }

    reset = () => {
        this.setState({
            id: undefined,
            previousId: undefined,
            saving: false,
            savedId: undefined,
            people: [],
            families: [],
            spendings: [],
            enableFamilies: false
        })
    }

    showExample = () => {
        this.disableAutofocus(() =>
            this.setState({
                showTips: true,
                people: JSON.parse(this.props.t('example.people')),
                families: JSON.parse(this.props.t('example.families')),
                spendings: JSON.parse(this.props.t('example.spendings')),

                enableFamilies: true
            })
        )
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

    disableAutofocus = (afterDisable: () => void) => {
        this.setState({
            focusOnNewMan: false,
            focusOnNewFamily: false,
            focusOnNewSpending: false
        }, afterDisable)
    }

    addMan = () => {
        const newMan = {
            id: uuidv4(),
            name: ""
        }
        const updatedPeople = [...this.state.people]
        updatedPeople.push(newMan)
        this.setState({
            people: updatedPeople,
            focusOnNewMan: true,
            focusOnNewFamily: false,
            focusOnNewSpending: false
        })
    }

    updateManName = (id: string, newName: string) => {
        const updatedMan = {
            id: id,
            name: newName
        } as Man

        const oldMan = this.state.people.find(value => value.id === id)!!
        const oldIndex = this.state.people.indexOf(oldMan)
        const updatedPeople = [...this.state.people]
        updatedPeople[oldIndex] = updatedMan
        this.disableAutofocus(() =>
            this.setState({people: updatedPeople})
        )
    }

    removeMan = (man: Man) => {
        const oldIndex = this.state.people.indexOf(man)
        const updatedPeople = [...this.state.people]
        updatedPeople.splice(oldIndex, 1)

        const updatedFamilies = [...this.state.families]
        this.state.families.forEach((family, familyIndex) => {
            const manIndex = family.members.indexOf(man.id)
            if (manIndex >= 0) {
                const updatedFamily = {...family};
                const updatedMembers = [...updatedFamily.members]
                updatedMembers.splice(manIndex, 1)
                updatedFamily.members = updatedMembers
                updatedFamilies[familyIndex] = updatedFamily
            }
        })

        const updatedSpendings = [...this.state.spendings]
        this.state.spendings.forEach((spending, spendingIndex) => {
            const updatedSpending = {...spending};

            const payedByIndex = spending.payedBy.indexOf(man.id)
            if (payedByIndex >= 0) {
                const updatedMembers = [...updatedSpending.payedBy]
                updatedMembers.splice(payedByIndex, 1)
                updatedSpending.payedBy = updatedMembers
            }

            const userIndex = spending.users.indexOf(man.id)
            if (userIndex >= 0) {
                const updatedMembers = [...updatedSpending.users]
                updatedMembers.splice(userIndex, 1)
                updatedSpending.users = updatedMembers
            }

            updatedSpendings[spendingIndex] = updatedSpending
        })
        this.disableAutofocus(() =>
            this.setState({people: updatedPeople, families: updatedFamilies, spendings: updatedSpendings})
        )
    }

    toggleEnableFamilies = () => {
        this.disableAutofocus(() =>
            this.setState({enableFamilies: !this.state.enableFamilies})
        )
    }

    peopleNotInFamilies = () => {
        const allPeople = this.state.people
        const peopleInFamilyIds = this.state.families.flatMap(value => value.members)
        return allPeople.filter(value => !peopleInFamilyIds.includes(value.id))
    }

    addFamily = () => {
        const newFamily = {
            id: uuidv4(),
            name: "",
            members: []
        }
        const updatedFamilies = [...this.state.families]
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
        const oldFamily = this.state.families.find(value => value.id === id)!!
        const updatedFamily = {
            id: id,
            name: newName,
            members: oldFamily.members
        } as Family


        const oldIndex = this.state.families.indexOf(oldFamily)
        const updatedFamilies = [...this.state.families]
        updatedFamilies[oldIndex] = updatedFamily
        this.disableAutofocus(() =>
            this.setState({families: updatedFamilies})
        )
    }

    removeFamily = (family: Family) => {
        const oldIndex = this.state.families.indexOf(family)
        const updatedFamilies = [...this.state.families]
        updatedFamilies.splice(oldIndex, 1)
        this.disableAutofocus(() =>
            this.setState({families: updatedFamilies})
        )
    }

    addManToFamily = (family: Family, man: Man) => {
        const updatedFamily = {
            id: family.id,
            name: family.name,
            members: [...family.members, man.id]
        }
        const index = this.state.families.indexOf(family);

        const updatedFamilies = [...this.state.families]
        updatedFamilies[index] = updatedFamily
        this.disableAutofocus(() =>
            this.setState({families: updatedFamilies})
        )
    }

    removeManFromFamily = (family: Family, manId: string) => {
        const updatedMembers = family.members.filter(value => value !== manId)
        const updatedFamily = {
            id: family.id,
            name: family.name,
            members: updatedMembers
        }
        const index = this.state.families.indexOf(family);
        const updatedFamilies = [...this.state.families]
        updatedFamilies[index] = updatedFamily
        this.disableAutofocus(() =>
            this.setState({families: updatedFamilies})
        )
    }

    addSpending = () => {
        const newSpending = {
            id: uuidv4(),
            name: "",
            spent: 0,
            payedBy: [],
            users: []
        }
        const updatedSpendings = [...this.state.spendings, newSpending]
        this.setState({
            spendings: updatedSpendings,
            focusOnNewMan: false,
            focusOnNewFamily: false,
            focusOnNewSpending: true
        })
    }

    removeSpending = (spending: Spending) => {
        const oldIndex = this.state.spendings.indexOf(spending)
        const updatedSpendings = [...this.state.spendings]
        updatedSpendings.splice(oldIndex, 1)
        this.disableAutofocus(() =>
            this.setState({spendings: updatedSpendings})
        )
    }

    updateSpendingName = (spending: Spending, newName: string) => {
        const updatedSpending = {...spending, name: newName}

        const index = this.state.spendings.indexOf(spending);
        const updatedSpendings = [...this.state.spendings]
        updatedSpendings[index] = updatedSpending
        this.disableAutofocus(() =>
            this.setState({spendings: updatedSpendings})
        )
    }

    updateSpendingPrice = (spending: Spending, newPrice: number) => {
        const updatedSpending = {...spending, spent: newPrice}

        const index = this.state.spendings.indexOf(spending);
        const updatedSpendings = [...this.state.spendings]
        updatedSpendings[index] = updatedSpending
        this.disableAutofocus(() =>
            this.setState({spendings: updatedSpendings})
        )
    }

    updatePayedBy = (spending: Spending, payedBy: Man[]) => {
        const updatedSpending = {...spending, payedBy: payedBy.map(value => value.id)}

        const index = this.state.spendings.indexOf(spending);
        const updatedSpendings = [...this.state.spendings]
        updatedSpendings[index] = updatedSpending
        this.disableAutofocus(() =>
            this.setState({spendings: updatedSpendings})
        )
    }

    updateUsedBy = (spending: Spending, usedBy: Man[]) => {
        const updatedSpending = {...spending, users: usedBy.map(value => value.id)}

        const index = this.state.spendings.indexOf(spending);
        const updatedSpendings = [...this.state.spendings]
        updatedSpendings[index] = updatedSpending
        this.disableAutofocus(() =>
            this.setState({spendings: updatedSpendings})
        )
    }

    summary = () => {
        const summaryRowsForPeople: SummaryRowMan[] = this.state.people.map(man => ({
            manId: man.id,
            paid: 0,
            used: 0,
            difference: 0
        }));
        this.state.spendings.forEach(spending => {
            const payedByMan = spending.spent / spending.payedBy.length
            const spentByMan = spending.spent / spending.users.length

            spending.payedBy.forEach(manId => {
                const payedMan = summaryRowsForPeople.find(it => it.manId === manId)
                payedMan!!.paid += payedByMan
                payedMan!!.difference += payedByMan
            })

            spending.users.forEach(manId => {
                const user = summaryRowsForPeople.find(it => it.manId === manId)
                user!!.used += spentByMan
                user!!.difference -= spentByMan
            })
        })

        const rows: (SummaryRowMan | SummaryRowFamily)[] = [];

        if (this.state.enableFamilies) {
            const validFamilies = this.state.families.filter(family => family.members.length > 0)

            const summaryRowsForFamilies: SummaryRowFamily[] = validFamilies.map(family => {
                let paid = 0
                let used = 0
                const summaryForMembers: SummaryRowMan[] = []
                family.members.forEach(manId => {
                    const summary = summaryRowsForPeople.find(summaryForMan => summaryForMan.manId === manId)!!
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
        const result = [] as OptimizedTransactions[];
        while (rowsWithDebts.length > 0) {
            rowsWithDebts.sort((a, b) => {
                return b.difference - a.difference
            })
            const maxCreditor = rowsWithDebts[0];
            const maxDebtor = rowsWithDebts[rowsWithDebts.length - 1];

            let sum;
            if (maxCreditor.difference > -(maxDebtor.difference)) {
                sum = -(maxDebtor.difference);
                rowsWithDebts.splice(rowsWithDebts.length - 1, 1);

                const newDifference = maxCreditor.difference - sum;
                if (Helpers.zero(newDifference)) {
                    rowsWithDebts.splice(0, 1);
                } else {
                    maxCreditor.difference = newDifference
                }
            } else {
                sum = maxCreditor.difference;
                rowsWithDebts.splice(0, 1);
                const newDifference = maxDebtor.difference + sum;
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
    id?: string;
    previousId?: string;
    loading: boolean;

    saving: boolean;
    savedId?: string;
    errorMessages: string[];

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
