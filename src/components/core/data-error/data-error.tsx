import { Button } from '@/components/ui-kit/button';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui-kit/card';
import type { ErrorResponse } from '@/hooks/use-error-handler';
import { t } from 'i18next';
import { ServerCrash, AlertCircle, RefreshCw } from 'lucide-react';

const getErrorMessage = (error: any): string => {
  if (error?.error?.Message) {
    return error.error.Message;
  }
  if (error?.message) {
    return error.message;
  }
  if (typeof error?.error === 'object' && error?.error !== null) {
    return 'An error occurred while loading data.';
  }
  return 'Unable to load data. Please try again.';
};

interface DataErrorProps {
  error: ErrorResponse | null;
  isLoading: boolean;
  onRetry: () => void;
  onGoBack?: () => void;
  title?: string;
  possibleCauses?: string[];
}

export const DataError: React.FC<DataErrorProps> = ({
  error,
  isLoading,
  onRetry,
  onGoBack,
  title,
  possibleCauses = [
    'The data schema may not be configured on the backend',
    'Network connectivity issues',
    'Server maintenance or temporary outage',
  ],
}) => {
  return (
    <div className="flex w-full h-[calc(100vh-200px)] items-center justify-center p-6">
      <Card className="max-w-2xl w-full border-red-200">
        <CardHeader>
          <div className="flex items-start gap-3">
            <div className="p-2 bg-red-100 rounded-lg">
              <ServerCrash className="h-6 w-6 text-red-600" />
            </div>
            <div className="flex-1">
              <CardTitle className="text-red-900 text-lg">
                {title || t('ERROR_LOADING_DATA') || 'Unable to Load Data'}
              </CardTitle>
              <CardDescription className="text-red-600 mt-1">
                {getErrorMessage(error)}
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-start gap-2">
              <AlertCircle className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-red-800 space-y-2">
                <p className="font-medium">Possible causes:</p>
                <ul className="list-disc list-inside space-y-1 ml-2">
                  {possibleCauses.map((cause, index) => (
                    <li key={index}>{cause}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button
              onClick={onRetry}
              variant="default"
              disabled={isLoading}
              className="flex-1 sm:flex-none"
            >
              <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
              {isLoading ? t('RETRYING') || 'Retrying...' : t('RETRY') || 'Try Again'}
            </Button>
            {onGoBack && (
              <Button onClick={onGoBack} variant="outline" className="flex-1 sm:flex-none">
                {t('GO_BACK') || 'Go Back'}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
