import { getMergedStep } from '~/modules/step';
import getStyles, { hexToRGB } from '~/styles';

import type { Props, Step } from '~/types';

const props: Props = {
  run: false,
  steps: [],
};

const customStylesProps: Props = {
  ...props,
  options: {
    arrowColor: '#00f',
    primaryColor: '#ff0',
    backgroundColor: '#00f',
    textColor: '#fff',
  },
  styles: {
    buttonPrimary: {
      color: '#00f',
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

  it('should return styles.arrow.color over options.arrowColor (component level)', () => {
    expect(
      getStyles(
        {
          ...props,
          options: { arrowColor: '#00f' },
          styles: { arrow: { color: '#f00' } },
        },
        getMergedStep(props, baseStep)!,
      ),
    ).toMatchSnapshot();
  });

  it('should return styles.arrow.color over options.arrowColor (step level)', () => {
    expect(
      getStyles(
        props,
        getMergedStep(props, {
          ...baseStep,
          arrowColor: '#00f',
          styles: { arrow: { color: '#f00' } },
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
    const step: Step = {
      ...baseStep,
      arrowColor: '#000',
      primaryColor: '#f00',
      backgroundColor: '#000',
      textColor: '#fff',
      styles: {
        buttonPrimary: {
          color: '#000',
        },
      },
    };

    expect(getStyles(customStylesProps, getMergedStep(customStylesProps, step)!)).toMatchSnapshot();
  });

  describe('hexToRGB', () => {
    it('should convert properly', () => {
      expect(hexToRGB('#ff0044')).toEqual([255, 0, 68]);
      expect(hexToRGB('#0f4')).toEqual([0, 255, 68]);
    });

    it('should return an empty array with invalid strings', () => {
      expect(hexToRGB('asa')).toEqual([]);
    });
  });
});
