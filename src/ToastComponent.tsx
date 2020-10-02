import React from 'react';
import {Translation, withTranslation, WithTranslation} from 'react-i18next';

export class ToastComponent extends React.Component<ToastComponentProps> {
    render() {
        return (
            <Translation>
                {t =>
                    <div id="toasts" aria-live="polite" aria-atomic="true"
                         style={{position: "fixed", top: 0, width: "100%", zIndex: 999}} >
                        <div className="mt-2 mr-2 ml-2" style={{position: "absolute", top: "0", right: "0"}}>
                            {this.props.errorMessages.map((errorMessage, index) => (
                                <div key={"error-message-toast-"+index}
                                     className="toast border border-danger" role="alert" aria-live="assertive"
                                     aria-atomic="true" data-autohide={false}>
                                    <div className="toast-header">
                                        <strong className="mr-auto">{t('calls.error')}</strong>
                                        <button type="button" className="ml-2 mb-1 close" data-dismiss="toast"
                                                aria-label="Close">
                                            <span aria-hidden="true">&times;</span>
                                        </button>
                                    </div>
                                    <div className="toast-body">
                                        {errorMessage}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                }
            </Translation>
        );
    }
}

interface ToastComponentProps extends WithTranslation {
    errorMessages: string[];
}

export default withTranslation()(ToastComponent)

