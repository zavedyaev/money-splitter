import React from 'react';
import {Translation, withTranslation, WithTranslation} from 'react-i18next';
import {OptimizedTransactions} from "./Models";
import {Helpers} from "./Helpers";

export class TransactionsComponent extends React.Component<TransactionsComponentProps> {
    render() {
        if (this.props.transactions.length === 0) return "";

        return (
            <Translation>
                {t =>
                    <div>
                        <h4>{t('transactions.header')}</h4>
                        <div className="alert alert-primary" role="alert" hidden={!this.props.showTips}>
                            {t('transactions.description')}
                        </div>
                        <div className="table-responsive">
                            <table className="table table-hover table-sm">
                                <thead>
                                <tr>
                                    <th scope="col">
                                        {this.props.enableFamilies ? t('transactions.debtorFamilyOrMan') : t('transactions.debtorMan')}
                                    </th>
                                    <th scope="col">
                                        {this.props.enableFamilies ? t('transactions.creditorFamilyOrMan') : t('transactions.creditorMan')}
                                    </th>
                                    <th scope="col" className="text-right">{t('transactions.debt')}</th>
                                </tr>
                                </thead>
                                <tbody>
                                {this.props.transactions.map((transactionRow, transactionRowIndex) => (
                                    <tr key={"family-row-" + transactionRowIndex}>
                                        <td>{transactionRow.debtorManOrFamilyName}</td>
                                        <td>{transactionRow.creditorManOrFamilyName}</td>
                                        <td className="text-right">{Helpers.round(transactionRow.debt)}</td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                }
            </Translation>
        );
    }
}

interface TransactionsComponentProps extends WithTranslation {
    showTips: boolean;
    transactions: OptimizedTransactions[];
    enableFamilies: boolean;
}

export default withTranslation()(TransactionsComponent)
