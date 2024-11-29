import { FC } from 'react';

import { Building, History, PlusIcon } from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const NewOldCompaniesLegend: FC = () => {
  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Legend</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="flex items-start space-x-3">
          <PlusIcon className="shrink-0 size-5 mt-0.5 text-primary" />
          <div>
            <div className="font-medium">First Time Companies</div>
            <p className="text-sm text-muted-foreground">
              Companies appearing for the first time in history.
            </p>
          </div>
        </div>

        <div className="flex items-start space-x-3">
          <Building className="shrink-0 size-5 mt-0.5 text-primary" />
          <div>
            <div className="font-medium">New Companies</div>
            <p className="text-sm text-muted-foreground">
              Companies that didn&apos;t post in the exact previous month. Excludes &ldquo;First
              Time Companies&ldquo; in the list, includes them in the graph.
            </p>
          </div>
        </div>

        <div className="flex items-start space-x-3">
          <History className="shrink-0 size-5 mt-0.5 text-primary" />
          <div>
            <div className="font-medium">Old Companies</div>
            <p className="text-sm text-muted-foreground">
              Companies that also posted in the exact previous month.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default NewOldCompaniesLegend;
