import { FC } from 'react';

import { Building, History, PlusIcon } from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const NewOldCompaniesLegend: FC = () => {
  return (
    <Card className="lg:w-1/2 flex flex-col gap-4 p-6">
      <div className="flex items-start space-x-3">
        <PlusIcon className="shrink-0 size-5 mt-0.5 text-primary" />
        <div>
          <div className="font-medium">First Time Companies</div>
          <p className="text-sm text-muted-foreground">
            Companies posting for the first time ever.
          </p>
        </div>
      </div>

      <div className="flex items-start space-x-3">
        <Building className="shrink-0 size-5 mt-0.5 text-primary" />
        <div>
          <div className="font-medium">New Companies</div>
          <p className="text-sm text-muted-foreground">
            Companies that did not post in the previous month. This excludes &ldquo;First-Time
            Companies&ldquo; from the list but includes them in the graph.
          </p>
        </div>
      </div>

      <div className="flex items-start space-x-3">
        <History className="shrink-0 size-5 mt-0.5 text-primary" />
        <div>
          <div className="font-medium">Old Companies</div>
          <p className="text-sm text-muted-foreground">
            Companies that also posted in the previous month.
          </p>
        </div>
      </div>
    </Card>
  );
};

export default NewOldCompaniesLegend;
