import React from 'react';
import './App.css';
import {Translation, withTranslation, WithTranslation} from 'react-i18next';
import {Family, Man, Spending} from "./Models";
import PeopleComponent from "./PeopleComponent";
import {v4 as uuidv4} from 'uuid';
import FamiliesComponent from "./FamiliesComponent";
import SpendingsComponent from "./SpendingsComponent";

export class App extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props);
        this.state = {
            people: [{
                id: "1",
                name: "West"
            }, {
                id: "2",
                name: "Lena"
            }, {
                id: "3",
                name: "Sasha"
            }, {
                id: "4",
                name: "Nastya"
            }, {
                id: "5",
                name: "Pasha"
            }, {
                id: "6",
                name: "Arina"
            }, {
                id: "7",
                name: "Serega"
            }, {
                id: "8",
                name: "Anya"
            }, {
                id: "9",
                name: "Albina"
            }],
            families: [{
                id: "1",
                name: "Zavedyaev",
                members: ["1", "2"]
            }, {
                id: "2",
                name: "Miheev",
                members: ["3", "4"]
            }, {
                id: "3",
                name: "Baldin",
                members: ["7", "8"]
            }, {
                id: "4",
                name: "Nikiforov",
                members: ["5", "6"]
            }, {
                id: "5",
                name: "Albina",
                members: ["9"]
            }],
            spendings: [{
                id: "1",
                name: "Tea",
                spent: 10.5,
                payedBy: ["1"],
                users: ["5", "6"]
            }, {
                id: "2",
                name: "Pineapple",
                spent: 89.99,
                payedBy: ["1", "5"],
                users: ["1", "5", "6"]
            }, {
                id: "2",
                name: "Oil",
                spent: 9.99,
                payedBy: ["5"],
                users: ["1", "5", "6"]
            }],
            enableFamilies: true
        }
    }

    render() {
        let peopleNotInFamilies = this.peopleNotInFamilies()
        return (
            <Translation>{t =>
                <div>
                    <h1>{t('description.title')}</h1>
                    <p>{t('description.value')}</p>
                    <PeopleComponent people={this.state.people} updateName={this.updateManName} addMan={this.addMan}
                                     removeMan={this.removeMan}/>
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
                                           updateFamilyName={this.updateFamilyName} addMan={this.addManToFamily}
                                           removeMan={this.removeManFromFamily}/>
                    }
                    <SpendingsComponent people={this.state.people} spendings={this.state.spendings}
                                        updateSpendingName={this.updateSpendingName}
                                        removeSpending={this.removeSpending} addSpending={this.addSpending}
                                        updateSpendingPrice={this.updateSpendingPrice}
                                        updatePayedBy={this.updatePayedBy} updateUsedBy={this.updateUsedBy}/>
                </div>
            }</Translation>
        );
    }

    addMan = () => {
        let newMan = {
            id: uuidv4(),
            name: ""
        }
        let updatedPeople = [...this.state.people]
        updatedPeople.push(newMan)
        this.setState({people: updatedPeople})
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
        this.setState({families: updatedFamilies})
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
        this.setState({spendings: updatedSpendings})
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
}

interface Props extends WithTranslation {
}

interface State {
    people: Man[];
    families: Family[];
    spendings: Spending[];
    enableFamilies: boolean;
}

export default withTranslation()(App)
