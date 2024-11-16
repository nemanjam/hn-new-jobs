import { FC } from 'react';
import Link from 'next/link';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

import { getThreadOrCommentUrlFromId } from '@/utils/urls';

import { DbCompany, NewOldCompanies } from '@/types/database';

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
            <CardTitle className="text-xl font-semibold">
              {section.title}{' '}
              <span className="text-muted-foreground">({section.companies.length})</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-3">
              {section.companies.map((company) => {
                const { name, commentId } = company;

                return (
                  <Badge
                    key={company.commentId}
                    variant="secondary"
                    className="hover:bg-primary hover:text-primary-foreground cursor-pointer transition-colors"
                  >
                    <Link
                      key={commentId}
                      href={getThreadOrCommentUrlFromId(commentId)}
                      target="_blank"
                    >
                      {name}
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

/*-------------------------------- old code ------------------------------*/

const printCompaniesLocal = (label: string, companies: DbCompany[]) => {
  return (
    <div className="flex flex-col gap-2">
      <label className="font-bold">{label}</label>
      <div className="flex flex-wrap gap-x-2">
        {companies.map((company) => {
          const { name, commentId } = company;

          return (
            <Link
              key={commentId}
              href={getThreadOrCommentUrlFromId(commentId)}
              target="_blank"
              className="whitespace-nowrap mr-2"
            >
              {name}
            </Link>
          );
        })}
      </div>
    </div>
  );
};

const printCompanies = (newOldCompanies: NewOldCompanies) => {
  const { newCompanies, oldCompanies, firstTimeCompanies } = newOldCompanies;

  return (
    <>
      {/* {printNumbers(newOldCompanies)} */}

      {printCompaniesLocal('First time companies:', firstTimeCompanies)}

      {printCompaniesLocal('New companies:', newCompanies)}

      {printCompaniesLocal('Old companies:', oldCompanies)}
    </>
  );
};

const printAllCompanies = (allNewOldCompanies: NewOldCompanies[]) => {
  return allNewOldCompanies.map((newOldCompanies) => {
    const { forMonth } = newOldCompanies;

    return (
      <div key={forMonth.name} className="flex flex-col gap-4">
        {printCompanies(newOldCompanies)}
      </div>
    );
  });
};
