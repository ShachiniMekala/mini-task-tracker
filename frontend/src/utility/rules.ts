export const rules = {
  required: (value: any) => {
    if (typeof value === 'string') {
      return value.trim() ? null : 'This field is required';
    }
    return value !== null && value !== undefined ? null : 'This field is required';
  },
  maxLength: (max: number) => (value: string) => {
    return value.length <= max ? null : `Cannot exceed ${max} characters`;
  },
  validate: (value: any, ruleList: Array<(val: any) => string | null>) => {
    for (const rule of ruleList) {
      const error = rule(value);
      if (error) return error;
    }
    return null;
  }
};

