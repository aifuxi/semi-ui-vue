import React from 'react';

function createIllustration(name: string): React.ComponentType<React.SVGProps<SVGSVGElement>> {
  return function SemiIllustrationStub(props): React.ReactElement {
    return (
      <svg
        width={200}
        height={200}
        viewBox="0 0 200 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        focusable={false}
        aria-hidden={true}
        data-stub-name={name}
        {...props}
      />
    );
  };
}

export const IllustrationConstruction = createIllustration('IllustrationConstruction');
export const IllustrationConstructionDark = createIllustration('IllustrationConstructionDark');
export const IllustrationFailure = createIllustration('IllustrationFailure');
export const IllustrationFailureDark = createIllustration('IllustrationFailureDark');
export const IllustrationIdle = createIllustration('IllustrationIdle');
export const IllustrationIdleDark = createIllustration('IllustrationIdleDark');
export const IllustrationNoAccess = createIllustration('IllustrationNoAccess');
export const IllustrationNoAccessDark = createIllustration('IllustrationNoAccessDark');
export const IllustrationNoContent = createIllustration('IllustrationNoContent');
export const IllustrationNoContentDark = createIllustration('IllustrationNoContentDark');
export const IllustrationNoResult = createIllustration('IllustrationNoResult');
export const IllustrationNoResultDark = createIllustration('IllustrationNoResultDark');
export const IllustrationNotFound = createIllustration('IllustrationNotFound');
export const IllustrationNotFoundDark = createIllustration('IllustrationNotFoundDark');
export const IllustrationSuccess = createIllustration('IllustrationSuccess');
export const IllustrationSuccessDark = createIllustration('IllustrationSuccessDark');
