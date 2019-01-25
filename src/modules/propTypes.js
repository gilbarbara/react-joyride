// @flow
import React from 'react';
import { isValidElementType, typeOf, Element, ForwardRef } from 'react-is';
import is from 'is-lite';

function createChainableTypeChecker(validate: Function): Function {
  function checkType(
    isRequired: boolean,
    props: Object,
    propName: string,
    componentName: string,
    location: string,
    propFullName: ?string,
    ...args: Array<*>
  ): ?Error {
    const componentNameSafe = componentName || '<<anonymous>>';
    const propFullNameSafe = propFullName || propName;

    /* istanbul ignore else */
    if (props[propName] == null) {
      if (isRequired) {
        return new Error(
          `Required ${location} \`${propFullNameSafe}\` was not specified in \`${componentNameSafe}\`.`,
        );
      }

      return null;
    }

    return validate(props, propName, componentNameSafe, location, propFullNameSafe, ...args);
  }

  const chainedCheckType = checkType.bind(null, false);
  chainedCheckType.isRequired = checkType.bind(null, true);

  return chainedCheckType;
}

export const componentTypeWithRefs = createChainableTypeChecker(
  (
    props: Object,
    propName: string,
    componentName: string,
    location: string,
    propFullName: string,
  ): any => {
    const propValue = props[propName];
    let Component = propValue;

    if (!React.isValidElement(propValue) && isValidElementType(propValue)) {
      const ownProps = {
        ref: () => {},
        step: {},
      };
      Component = <Component {...ownProps} />;
    }

    if (
      is.string(propValue) ||
      is.number(propValue) ||
      !isValidElementType(propValue) ||
      ![Element, ForwardRef].includes(typeOf(Component))
    ) {
      return new Error(
        `Invalid ${location} \`${propFullName}\` supplied to \`${componentName}\`. Expected a React class or forwardRef.`,
      );
    }

    return undefined;
  },
);
