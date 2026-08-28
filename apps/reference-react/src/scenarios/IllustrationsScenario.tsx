import React from 'react';
import {
  IllustrationConstruction,
  IllustrationConstructionDark,
  IllustrationFailure,
  IllustrationFailureDark,
  IllustrationIdle,
  IllustrationIdleDark,
  IllustrationNoAccess,
  IllustrationNoAccessDark,
  IllustrationNoContent,
  IllustrationNoContentDark,
  IllustrationNoResult,
  IllustrationNoResultDark,
  IllustrationNotFound,
  IllustrationNotFoundDark,
  IllustrationSuccess,
  IllustrationSuccessDark,
} from '@semi-v2.102.0/illustrations';

const illustrationPairs = [
  ['Construction', IllustrationConstruction, IllustrationConstructionDark],
  ['Failure', IllustrationFailure, IllustrationFailureDark],
  ['Idle', IllustrationIdle, IllustrationIdleDark],
  ['NoAccess', IllustrationNoAccess, IllustrationNoAccessDark],
  ['NoContent', IllustrationNoContent, IllustrationNoContentDark],
  ['NoResult', IllustrationNoResult, IllustrationNoResultDark],
  ['NotFound', IllustrationNotFound, IllustrationNotFoundDark],
  ['Success', IllustrationSuccess, IllustrationSuccessDark],
] as const;

export function IllustrationsScenario(): React.ReactElement {
  return (
    <div className="illustrations-scenario" data-testid="illustrations-reference">
      {illustrationPairs.flatMap(([name, LightIllustration, DarkIllustration]) => [
        <figure className="illustrations-scenario__item" key={name} aria-label={name}>
          <LightIllustration className="illustrations-scenario__svg" data-illustration={name} />
        </figure>,
        <figure
          className="illustrations-scenario__item illustrations-scenario__item--dark"
          key={`${name}Dark`}
          aria-label={`${name}Dark`}
        >
          <DarkIllustration
            className="illustrations-scenario__svg"
            data-illustration={`${name}Dark`}
          />
        </figure>,
      ])}
    </div>
  );
}
