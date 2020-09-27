import React from 'react';
import {Translation, withTranslation, WithTranslation} from 'react-i18next';
import {Family, Man, Summary} from "./Models";
import {Helpers} from "./Helpers";

export class SummaryComponent extends React.Component<SummaryComponentProps, SummaryComponentState> {
    constructor(props: SummaryComponentProps) {
        super(props);
        this.state = {
            expandedFamilyIds: []
        }
    }

    render() {
        if (this.props.summary.rows.length === 0) return "";

        return (
            <Translation>
                {t =>
                    <div>
                        <h4>{t('summary.header')}</h4>
                        <div className="alert alert-primary" role="alert">
                            {t('summary.description')}
                        </div>
                        <div className="table-responsive">
                            <table className="table table-hover table-sm">
                                <thead>
                                <tr>
                                    <th scope="col" colSpan={2}>
                                        {this.props.enableFamilies ? t('summary.familyOrMan') : t('summary.man')}
                                    </th>
                                    <th scope="col" className="text-right">{t('summary.paid')}</th>
                                    <th scope="col" className="text-right">{t('summary.spent')}</th>
                                    <th scope="col" className="text-right">{t('summary.difference')}</th>
                                </tr>
                                </thead>

                                {this.props.summary.rows.map((summaryRow, summaryRowIndex) => (
                                    <tbody key={"family-row-" + summaryRowIndex}>
                                    <tr className={("familyId" in summaryRow ? "family " : "") + (Helpers.positive(summaryRow.difference) ?
                                        "table-success" :
                                        (Helpers.negative(summaryRow.difference) ? "table-danger" : ""))}
                                        onClick={() => {
                                            if ("familyId" in summaryRow) this.toggleFamilyRow(summaryRow.familyId);
                                        }}
                                    >
                                        <td colSpan={2}
                                            className={"familyId" in summaryRow ? "name" + (this.familyRowExpanded(summaryRow.familyId) ? "-expanded" : "") : ""}>
                                            {"familyId" in summaryRow ?
                                                this.props.families.find(family => family.id === summaryRow.familyId)!!.name :
                                                this.props.people.find(man => man.id === summaryRow.manId)!!.name
                                            }
                                        </td>
                                        <td className="text-right">{Helpers.round(summaryRow.paid)}</td>
                                        <td className="text-right">{Helpers.round(summaryRow.used)}</td>
                                        <td className="text-right">{Helpers.round(summaryRow.difference)}</td>
                                    </tr>
                                    {"summaryForMembers" in summaryRow && this.familyRowExpanded(summaryRow.familyId) ? summaryRow.summaryForMembers.map((summaryForMan, summaryForManIndex) => (
                                        <tr key={"family-member-row-" + summaryRowIndex + '-' + summaryForManIndex}
                                            className={Helpers.positive(summaryForMan.difference) ? "table-success" : (Helpers.negative(summaryForMan.difference) ? "table-danger" : "")}>
                                            <td> </td>
                                            <td>{this.props.people.find(man => man.id === summaryForMan.manId)!!.name}</td>
                                            <td className="text-right">{Helpers.round(summaryForMan.paid)}</td>
                                            <td className="text-right">{Helpers.round(summaryForMan.used)}</td>
                                            <td className="text-right">{Helpers.round(summaryForMan.difference)}</td>
                                        </tr>
                                    )) : undefined}
                                    </tbody>
                                ))}

                            </table>
                        </div>
                    </div>
                }
            </Translation>
        );
    }

    familyRowExpanded = (familyId: string) => {
        return !!this.state.expandedFamilyIds.find(it => it === familyId);
    }
    toggleFamilyRow = (familyId: string) => {
        let index = this.state.expandedFamilyIds.indexOf(familyId)
        let newExpandedFamilyIds = [...this.state.expandedFamilyIds];
        if (index >= 0) {
            newExpandedFamilyIds.splice(index, 1)
        } else {
            newExpandedFamilyIds.push(familyId)
        }
        this.setState({expandedFamilyIds: newExpandedFamilyIds});
    }
}

interface SummaryComponentProps extends WithTranslation {
    people: Man[];
    enableFamilies: boolean;
    families: Family[];
    summary: Summary;
}

interface SummaryComponentState {
    expandedFamilyIds: string[];
}

export default withTranslation()(SummaryComponent)

