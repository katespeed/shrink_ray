type DatabaseConstraintError = {
  type: 'unique' | 'check' | 'not null' | 'foreign key' | 'unknown';
  columnName?: string;
  message?: string;
};

type AuthRequest = {
  username: string;
  password: string;
};

type RequestUrl = {
  originalUrl: string;
};

type TargetLinkId = {
  targetLinkId: string;
};
