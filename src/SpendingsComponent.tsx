import React, {ChangeEvent} from 'react';
import {Translation, withTranslation, WithTranslation} from 'react-i18next';
import {Man, Spending} from "./Models";
import MultiSelect from "react-multi-select-component";

export class SpendingsComponent extends React.Component<SpendingsComponentProps> {
    render() {
        let peopleOptions = this.props.people.map(man => ({label: man.name, value: man.id}));

        return (
            <Translation>
                {t =>
                    <div>
                        <h5>
                            {t('spendings.header')}
                        </h5>
                        <div className="alert alert-primary" role="alert">
                            {t('spendings.description')}
                        </div>
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
                                                       autoFocus={this.props.focusOnNewItem}
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
                                            <form onSubmit={e => { e.preventDefault()}}>
                                                <div className="form-group row">
                                                    <label htmlFor={"priceInput" + index}
                                                           className="col-sm-4 col-md-5 col-form-label">{t('spendings.price')}</label>
                                                    <div className="input-group col-sm-8 col-md-7">
                                                        <input type="number"
                                                               className={"form-control " + (spending.spent > 0 ? "" : "is-invalid")}
                                                               id={"priceInput" + index}
                                                               min={0} step={0.01}
                                                               value={spending.spent === 0 ? "" : spending.spent}
                                                               onChange={e => this.onPriceChange(spending, e)}/>
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
                                                        <MultiSelect
                                                            className={"multiselect " + (spending.payedBy.length > 0 ? "" : "is-invalid")}
                                                            options={peopleOptions}
                                                            value={peopleOptions.filter(option => spending.payedBy.find(value => value === option.value ))}
                                                            onChange={(e: any) => this.props.updatePayedBy(spending, this.parseSelectedPeople(e))}
                                                            labelledBy={t('choose')}
                                                            disableSearch
                                                            overrideStrings={{selectSomeItems: t('choose'),
                                                                allItemsAreSelected: t('all'),
                                                                selectAll: t('selectAll'),
                                                                search: t('search'),
                                                                clearSearch: t('clearSearch')
                                                            }}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="form-group row">
                                                    <label htmlFor={"usedByInput" + index}
                                                           className="col-sm-4 col-md-5 col-form-label">{t('spendings.usedBy')}</label>
                                                    <div className="col-sm-8 col-md-7">
                                                        <MultiSelect
                                                            className={"multiselect " + (spending.users.length > 0 ? "" : "is-invalid")}
                                                            options={peopleOptions}
                                                            value={peopleOptions.filter(option => spending.users.find(value => value === option.value ))}
                                                            onChange={(e: any) => this.props.updateUsedBy(spending, this.parseSelectedPeople(e))}
                                                            labelledBy={t('choose')}
                                                            disableSearch
                                                            overrideStrings={{selectSomeItems: t('choose'),
                                                                allItemsAreSelected: t('all'),
                                                                selectAll: t('selectAll'),
                                                                search: t('search'),
                                                                clearSearch: t('clearSearch')
                                                            }}
                                                        />
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

    //fixme because of browser issue "01" and "1" values in input-number are the same, and event returns only number 1
    //  it does not allows us to remove leading zeros
    removeLeadingZeros = (input: string) => {
        let withoutLeadingZeros = input.replace(/^0+/, '')
        if (withoutLeadingZeros.length === 0) return "0"
        if (/^[,.]/.test(withoutLeadingZeros)) return "0"+withoutLeadingZeros
        return withoutLeadingZeros
    }

    onPriceChange = (spending: Spending, e: ChangeEvent<HTMLInputElement>) => {
        let valid = (e.target.validity.valid) ? e.target.value : spending.spent;
        let withoutLeadingZeros = this.removeLeadingZeros(valid.toString())
        this.props.updateSpendingPrice(spending, +withoutLeadingZeros)
    }

    parseSelectedPeople = (options: any[]): Man[] => {
        let selectedPeopleIds: string[] = []
        for (let i = 0; i < options.length; i++) {
            selectedPeopleIds.push(options[i].value);
        }
        return this.props.people.filter(man => selectedPeopleIds.find(selectedId => selectedId === man.id))
    }
}

interface SpendingsComponentProps extends WithTranslation {
    focusOnNewItem: boolean;
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

