import React from 'react';
import { useSuccessSubscription } from './useSuccessSubscription';
import ActivationLoading from '../../../components/subscription/succesSubscription/ActivationLoading';
import ActivationError from '../../../components/subscription/succesSubscription/ActivationError';
import ActivationSuccess from '../../../components/subscription/succesSubscription/ActivationSuccess';

const SuccessSubscriptionPage: React.FC = () => {
    const { status, errorMsg, navigate } = useSuccessSubscription();

    if (status === 'loading') return <ActivationLoading />;

    if (status === 'error') return (
        <ActivationError
            message={errorMsg}
            onGoToReceipts={() => navigate('/receipts')}
            onGoToMain={() => navigate('/chat')}
        />
    );

    return (
        <ActivationSuccess
            onGoToReceipts={() => navigate('/receipts')}
            onGoToMain={() => navigate('/chat')}
        />
    );
};

export default SuccessSubscriptionPage;
