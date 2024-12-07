import { FC } from 'react';
import Link from 'next/link';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

import { humanFormat } from '@/libs/datetime';
import { getThreadOrCommentUrlFromId } from '@/utils/urls';

import { NewOldCompanies } from '@/types/database';

interface Props {
  newOldCompanies: NewOldCompanies;
}

const NewOldCompaniesList: FC<Props> = ({ newOldCompanies }) => {
  const { firstTimeCompanies, newCompanies, oldCompanies } = newOldCompanies;

  const sections = [
    { title: 'First Time Companies', companies: firstTimeCompanies },
    { title: 'New Companies', companies: newCompanies },
    { title: 'Old Companies', companies: oldCompanies },
  ];

  return (
    <div className="grid gap-6">
      {sections.map((section) => (
        <Card key={section.title}>
          <CardHeader>
            <CardTitle className="text-xl font-semibold space-x-2">
              <span>{section.title}</span>
              <span className="text-muted-foreground">({section.companies.length})</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-3">
              {section.companies.map((companyWithComments) => {
                // correct company for month with correct link (commentId), selected already in database
                // comments only for count
                const { company, comments } = companyWithComments;
                const { name, commentId, createdAtOriginal } = company;

                return (
                  <Badge
                    key={commentId}
                    variant="secondary"
                    className="hover:bg-primary hover:text-primary-foreground cursor-pointer transition-colors"
                  >
                    <Link
                      key={commentId}
                      href={getThreadOrCommentUrlFromId(commentId)}
                      target="_blank"
                      title={humanFormat(createdAtOriginal)}
                    >
                      {`${name} (${comments.length})`}
                    </Link>
                  </Badge>
                );
              })}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default NewOldCompaniesList;
