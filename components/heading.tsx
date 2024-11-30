import { FC, ReactNode } from 'react';

export interface Props {
  title: ReactNode;
  subTitle: ReactNode;
}

const Heading: FC<Props> = ({ title, subTitle }) => {
  return (
    <div className="flex max-w-[980px] flex-col items-start gap-2">
      <h1 className="text-3xl font-extrabold leading-tight tracking-tighter md:text-4xl">
        {title}
      </h1>
      <p className="max-w-[700px] text-lg text-muted-foreground">{subTitle}</p>
    </div>
  );
};

export default Heading;
