export type ButtonMystNode = {
  type: 'reactiveButton';
  label?: string;
  labelFunction?: string;
  disabled?: string;
  disabledFunction?: string;
  clickFunction?: string;
};

export type DisplayMystNode = {
  type: 'reactiveDisplay';
  value?: string;
  valueFunction?: string;
  format?: string;
  transformFunction?: string;
};

export type DynamicMystNode = {
  type: 'reactiveDynamic';
  value?: string;
  valueFunction?: string;
  changeFunction?: string;
  format?: string;
  min?: string;
  minFunction?: string;
  max?: string;
  maxFunction?: string;
  step?: string;
  stepFunction?: string;
};

export type RangeMystNode = {
  type: 'reactiveRange';
  value?: string;
  valueFunction?: string;
  changeFunction?: string;
  format?: string;
  min?: string;
  minFunction?: string;
  max?: string;
  maxFunction?: string;
  step?: string;
  stepFunction?: string;
};

export type SwitchMystNode = {
  type: 'reactiveSwitch';
  value?: string;
  valueFunction?: string;
  changeFunction?: string;
  label?: string;
};

export type VariableMystNode = {
  type: 'reactiveVariable';
  name: string;
  value?: string;
  valueFunction?: string;
  format?: string;
};
