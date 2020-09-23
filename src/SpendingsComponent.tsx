import React from 'react';
import {Translation, withTranslation, WithTranslation} from 'react-i18next';
import {Man, Spending} from "./Models";

export class SpendingsComponent extends React.Component<SpendingsComponentProps> {
    render() {
        return (
            <Translation>
                {t =>
                    <div>
                        <h5>
                            {t('spendings.header')}
                        </h5>
                        <div className="row row-cols-1 row-cols-md-2 row-cols-xl-3">
                            {this.props.spendings.map((spending, index) => (
                                <div className="col mb-4" key={"spending-" + index}>
                                    <div className="card">
                                        <div className="card-header">
                                            <div className="input-group">
                                                <input type="text"
                                                       className={"form-control form-control-lg " + (spending.name.length > 0 ? "" : "is-invalid")}
                                                       placeholder={t('spendings.namePlaceholder')}
                                                       aria-label={t('spendings.namePlaceholder')}
                                                       aria-describedby={"delete-spending-" + index + "-button"}
                                                       value={spending.name}
                                                       onChange={event => this.props.updateSpendingName(spending, event.target.value)}
                                                />
                                                <div className="input-group-append">
                                                    <button className="btn btn-outline-danger" type="button"
                                                            id={"delete-spending-" + index + "-button"}
                                                            onClick={() => this.props.removeSpending(spending)}>
                                                        X
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="card-body">
                                            <form>
                                                <div className="form-group row">
                                                    <label htmlFor={"priceInput" + index}
                                                           className="col-sm-4 col-md-5 col-form-label">{t('spendings.price')}</label>
                                                    <div className="input-group col-sm-8 col-md-7">
                                                        <input type="number"
                                                               className={"form-control " + (spending.spent > 0 ? "" : "is-invalid")}
                                                               id={"priceInput" + index}
                                                               min={0} step={0.01} value={spending.spent}
                                                               onChange={e => this.props.updateSpendingPrice(spending, +e.target.value)}/>
                                                        <div className="input-group-append">
                                                            <span className="input-group-text">
                                                                {t('spendings.currency')}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="form-group row">
                                                    <label htmlFor={"payedByInput" + index}
                                                           className="col-sm-4 col-md-5 col-form-label">{t('spendings.payedBy')}</label>
                                                    <div className="col-sm-8 col-md-7">
                                                        {/*todo replace by react-multi-select-component*/}
                                                        <select multiple
                                                                className={"form-control " + (spending.payedBy.length > 0 ? "" : "is-invalid")}
                                                                id={"payedByInput" + index}
                                                                value={spending.payedBy.map(value => value.id)}
                                                                onChange={e => this.props.updatePayedBy(spending, this.parseSelectedPeople(e.target.options))}>
                                                            {this.props.people.map((man, manIndex) => (
                                                                <option key={"payedBy-option-" + index + "-" + manIndex}
                                                                        value={man.id}>
                                                                    {man.name}
                                                                </option>
                                                            ))}
                                                        </select>
                                                    </div>
                                                </div>
                                                <div className="form-group row">
                                                    <label htmlFor={"usedByInput" + index}
                                                           className="col-sm-4 col-md-5 col-form-label">{t('spendings.usedBy')}</label>
                                                    <div className="col-sm-8 col-md-7">
                                                        {/*todo replace by react-multi-select-component*/}
                                                        <select multiple
                                                                className={"form-control " + (spending.users.length > 0 ? "" : "is-invalid")}
                                                                id={"usedByInput" + index}
                                                                value={spending.users.map(value => value.id)}
                                                                onChange={e => this.props.updateUsedBy(spending, this.parseSelectedPeople(e.target.options))}>
                                                            {this.props.people.map((man, manIndex) => (
                                                                <option key={"usedBy-option-" + index + "-" + manIndex}
                                                                        value={man.id}>
                                                                    {man.name}
                                                                </option>
                                                            ))}
                                                        </select>
                                                    </div>
                                                </div>
                                            </form>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <button type="button" className="btn btn-primary" onClick={() => this.props.addSpending()}>
                            {t('spendings.add')}
                        </button>
                    </div>
                }
            </Translation>
        );
    }

    parseSelectedPeople = (options: HTMLOptionsCollection): Man[] => {
        let selectedPeopleIds: string[] = []
        for (let i = 0; i < options.length; i++) {
            if (options[i].selected) {
                selectedPeopleIds.push(options[i].value);
            }
        }
        return this.props.people.filter(man => selectedPeopleIds.find(selectedId => selectedId === man.id))
    }
}

interface SpendingsComponentProps extends WithTranslation {
    people: Man[];
    spendings: Spending[];

    updateSpendingName: (spending: Spending, newName: string) => void;
    addSpending: () => void;
    removeSpending: (spending: Spending) => void;
    updateSpendingPrice: (spending: Spending, newPrice: number) => void;
    updatePayedBy: (spending: Spending, payedBy: Man[]) => void
    updateUsedBy: (spending: Spending, payedBy: Man[]) => void
}

export default withTranslation()(SpendingsComponent)

