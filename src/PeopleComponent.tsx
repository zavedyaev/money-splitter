import React from 'react';
import {Translation, withTranslation, WithTranslation} from 'react-i18next';
import {Man} from "./Models";

export class PeopleComponent extends React.Component<PeopleComponentProps> {
    render() {
        return (
            <Translation>
                {(t: (name :string) => string) =>
                    <div className="card">
                        <h5 className="card-header" id="peopleHeading">
                            <a data-toggle="collapse" data-target="#peopleCollapse" aria-expanded="true"
                               aria-controls="peopleCollapse" href="#peopleHeading">
                                {t('people.header')}
                            </a>
                        </h5>
                        <div id="peopleCollapse" className="collapse show" aria-labelledby="peopleHeading">
                            <div className="card-body">
                                <div className="alert alert-primary" role="alert" hidden={!this.props.showTips}>
                                    {t('people.description')}
                                </div>
                                <div className="form-row">
                                    {this.props.people.map((man, index) => (
                                        <div className="input-group col-sm-6 col-md-4 col-lg-3 col-xl-2 mt-1 mb-1"
                                             key={"man-" + index}>
                                            <input type="text"
                                                   autoFocus={this.props.focusOnNewItem}
                                                   className={man.name.length > 0 ? "form-control" : "form-control is-invalid"}
                                                   placeholder={t('people.namePlaceholder')}
                                                   aria-label={t('people.namePlaceholder')}
                                                   aria-describedby={"delete-user-" + index + "-button"}
                                                   value={man.name}
                                                   onChange={event => this.props.updateName(man.id, event.target.value)}
                                            />
                                            <div className="input-group-append">
                                                <button className="btn btn-outline-danger" type="button"
                                                        id={"delete-user-" + index + "-button"}
                                                        onClick={() => this.props.removeMan(man)}>
                                                    X
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="card-footer">
                                <button type="button" className="btn btn-primary" onClick={() => this.props.addMan()}>
                                    {t('people.add')}
                                </button>
                            </div>
                        </div>
                    </div>
                }
            </Translation>
        );
    }
}

interface PeopleComponentProps extends WithTranslation {
    showTips: boolean;
    focusOnNewItem: boolean;
    people: Man[];
    updateName: (id: string, newName: string) => void;
    addMan: () => void;
    removeMan: (man: Man) => void;
}

export default withTranslation()(PeopleComponent)

