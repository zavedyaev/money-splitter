import React from 'react';
import './App.css';
import {Translation, withTranslation, WithTranslation} from 'react-i18next';
import {Family, Man, Spending} from "./Models";
import PeopleComponent from "./PeopleComponent";
import {v4 as uuidv4} from 'uuid';
import FamiliesComponent from "./FamiliesComponent";

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
                members: [
                    {
                        id: "1",
                        name: "West"
                    }, {
                        id: "2",
                        name: "Lena"
                    }
                ]
            }, {
                id: "2",
                name: "Miheev",
                members: [
                    {
                        id: "3",
                        name: "Sasha"
                    }, {
                        id: "4",
                        name: "Nastya"
                    }
                ]
            }, {
                id: "3",
                name: "Baldin",
                members: [
                    {
                        id: "7",
                        name: "Serega"
                    }, {
                        id: "8",
                        name: "Anya"
                    }
                ]
            }, {
                id: "4",
                name: "Nikiforov",
                members: [
                    {
                        id: "5",
                        name: "Pasha"
                    }, {
                        id: "6",
                        name: "Arina"
                    }
                ]
            }, {
                id: "5",
                name: "Albina",
                members: [
                    {
                        id: "9",
                        name: "Albina"
                    }
                ]
            }],
            spendings: [],
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
                        <FamiliesComponent people={peopleNotInFamilies} families={this.state.families}
                                           addFamily={this.addFamily} removeFamily={this.removeFamily}
                                           updateFamilyName={this.updateFamilyName} addMan={this.addManToFamily}
                                           removeMan={this.removeManFromFamily}/>
                    }
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
        this.setState({people: updatedPeople})
    }

    toggleEnableFamilies = () => {
        this.setState({enableFamilies: !this.state.enableFamilies})
    }

    peopleNotInFamilies = () => {
        let allPeople = this.state.people
        let peopleInFamilyIds = this.state.families.flatMap(value => value.members).map(value => value.id)
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
            members: [...family.members, man]
        }
        let index = this.state.families.indexOf(family);

        let updatedFamilies = [...this.state.families]
        updatedFamilies[index] = updatedFamily
        this.setState({families: updatedFamilies})
    }

    removeManFromFamily = (family: Family, man: Man) => {
        let updatedMembers = family.members.filter(value => value !== man)
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
