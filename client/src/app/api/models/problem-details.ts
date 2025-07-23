export type ProblemDetails = ({
      type?: (string) | (null);
      title?: (string) | (null);
      status?: (number) | (null);
      detail?: (string) | (null);
      instance?: (string) | (null);
    }) & (Record<string, unknown>);
