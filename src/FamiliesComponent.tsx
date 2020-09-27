import React from 'react';
import {Translation, withTranslation, WithTranslation} from 'react-i18next';
import {Family, Man} from "./Models";

export class FamiliesComponent extends React.Component<FamiliesComponentProps, FamiliesComponentState> {
    constructor(props: FamiliesComponentProps) {
        super(props);
        this.state = {
            selectedFamilyId: undefined
        }
    }

    render() {
        let selectedFamily = this.props.families.find(value => value.id === this.state.selectedFamilyId)
        return (
            <Translation>
                {t =>
                    <div className="card">
                        <h5 className="card-header" id="familiesHeading">
                            <a data-toggle="collapse" data-target="#familiesCollapse" aria-expanded="true"
                               aria-controls="familiesCollapse" href="#familiesHeading">
                                {t('families.header')}
                            </a>
                        </h5>
                        <div id="familiesCollapse" className="collapse show" aria-labelledby="familiesHeading">
                            <div className="card-body">
                                <div>
                                    <h6>{t('families.header')}</h6>
                                    <div className="alert alert-primary" role="alert" hidden={!this.props.showTips}>
                                        {t('families.description')}
                                    </div>
                                    <div className="form-row">
                                        {this.props.families.map((family, index) => (
                                            <div className="input-group col-sm-6 col-md-6 col-lg-4 col-xl-3"
                                                 key={"family-" + index}>
                                                <div className="input-group-prepend">
                                                    <div className="input-group-text">
                                                        <input type="radio" name="selectedFamily"
                                                               checked={family.id === this.state.selectedFamilyId}
                                                               onChange={() => this.selectFamily(family)}
                                                        />
                                                    </div>
                                                </div>
                                                <input type="text"
                                                       autoFocus={this.props.focusOnNewItem}
                                                       className={family.name.length > 0 && family.members.length > 0 ? "form-control" : "form-control is-invalid"}
                                                       placeholder={t('families.namePlaceholder')}
                                                       aria-label={t('families.namePlaceholder')}
                                                       aria-describedby={"delete-user-" + index + "-button"}
                                                       value={family.name}
                                                       onChange={event => this.props.updateFamilyName(family.id, event.target.value)}
                                                />
                                                <div className="input-group-append">
                                                    <button className="btn btn-outline-danger" type="button"
                                                            id={"delete-user-" + index + "-button"}
                                                            onClick={() => this.removeFamily(family)}>
                                                        X
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div hidden={!this.state.selectedFamilyId}>
                                    <h6>{t('families.members')}</h6>
                                    <div className="form-row">
                                        {selectedFamily?.members.map((manId, index) => (
                                            <div className="input-group col-sm-6 col-md-4 col-lg-3 col-xl-2"
                                                 key={"member-of-selected-family-" + index}>
                                                <input type="text"
                                                       className="form-control"
                                                       aria-describedby={"delete-family-member-" + index + "-button"}
                                                       value={this.props.people.find(it => it.id === manId)?.name}
                                                       readOnly={true}
                                                />

                                                <div className="input-group-append">
                                                    <button className="btn btn-outline-danger" type="button"
                                                            id={"delete-family-member-" + index + "-button"}
                                                            onClick={() => this.props.removeMan(selectedFamily!!, manId)}>
                                                        X
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div hidden={this.props.signlePeople.length === 0 || this.props.families.length === 0}>
                                    <h6>{t('families.singlePeople')}</h6>
                                    <div className="form-row">
                                        {this.props.signlePeople.map((man, index) => (
                                            <div className="input-group col-sm-6 col-md-4 col-lg-3 col-xl-2"
                                                 key={"single-man-" + index}>
                                                <input type="text"
                                                       className={man.name.length > 0 ? "form-control" : "form-control is-invalid"}
                                                       placeholder={t('people.namePlaceholder')}
                                                       aria-label={t('people.namePlaceholder')}
                                                       aria-describedby={"add-family-member-" + index + "-button"}
                                                       value={man.name}
                                                       readOnly={true}
                                                />

                                                <div className="input-group-append">
                                                    <button className="btn btn-outline-success" type="button"
                                                            id={"add-family-member-" + index + "-button"}
                                                            disabled={!this.state.selectedFamilyId}
                                                            onClick={() => this.props.addMan(selectedFamily!!, man)}>
                                                        +
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                            <div className="card-footer">
                                <button type="button" className="btn btn-primary"
                                        onClick={this.addFamily}>
                                    {t('families.add')}
                                </button>
                            </div>
                        </div>
                    </div>
                }
            </Translation>
        );
    }

    selectFamily = (family: Family) => {
        this.setState({selectedFamilyId: family.id})
    }

    addFamily = () => {
        let id = this.props.addFamily()
        this.setState({selectedFamilyId: id})
    }

    removeFamily = (family: Family) => {
        if (this.state.selectedFamilyId === family.id) {
            this.setState({selectedFamilyId: undefined})
        }
        this.props.removeFamily(family)
    }
}

interface FamiliesComponentProps extends WithTranslation {
    showTips: boolean;
    focusOnNewItem: boolean;
    people: Man[];
    signlePeople: Man[];
    families: Family[];
    updateFamilyName: (id: string, newName: string) => void;
    addFamily: () => string;
    removeFamily: (family: Family) => void;
    addMan: (family: Family, man: Man) => void;
    removeMan: (family: Family, manId: string) => void;
}

interface FamiliesComponentState {
    selectedFamilyId?: string;

}

export default withTranslation()(FamiliesComponent)

