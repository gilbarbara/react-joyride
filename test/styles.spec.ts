import { getMergedStep } from '~/modules/step';

import getStyles from '~/styles';
import { Props, Step } from '~/types';

const props: Props = {
  run: false,
  steps: [],
};

const customStylesProps = {
  ...props,
  styles: {
    buttonNext: {
      color: '#00f',
    },
    options: {
      arrowColor: '#00f',
      primaryColor: '#ff0',
      backgroundColor: '#00f',
      textColor: '#fff',
    },
  },
};

const baseStep: Step = {
  content: 'Hello',
  target: 'body',
};

describe('styles', () => {
  it('should return the default styles', () => {
    expect(getStyles(props, getMergedStep(props, baseStep)!)).toMatchSnapshot();
  });

  it("should return the component floaterProps' arrow color instead of styles.options.arrowColor", () => {
    expect(
      getStyles(
        {
          ...props,
          floaterProps: { styles: { arrow: { color: '#f00' } } },
          styles: { options: { arrowColor: '#00f' } },
        },
        getMergedStep(props, baseStep)!,
      ),
    ).toMatchSnapshot();
  });

  it("should return the step floaterProps' arrow color instead of styles.options.arrowColor", () => {
    expect(
      getStyles(
        props,
        getMergedStep(props, {
          ...baseStep,
          floaterProps: { styles: { arrow: { color: '#f00' } } },
          styles: { options: { arrowColor: '#00f' } },
        })!,
      ),
    ).toMatchSnapshot();
  });

  it("should return the inherited props' styles", () => {
    expect(
      getStyles(customStylesProps, getMergedStep(customStylesProps, baseStep)!),
    ).toMatchSnapshot();
  });

  it("should return the step's styles", () => {
    const step = {
      ...baseStep,
      styles: {
        buttonNext: {
          color: '#000',
        },
        options: {
          arrowColor: '#000',
          primaryColor: '#f00',
          backgroundColor: '#000',
          textColor: '#fff',
        },
      },
    };

    expect(getStyles(customStylesProps, getMergedStep(customStylesProps, step)!)).toMatchSnapshot();
  });
});
