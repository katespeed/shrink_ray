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

type TargetLinkIdParam = {
  targetLinkId: string;
};

type TargetUserIdParam = {
  targetUserId: string;
};

type LinkIdParam = {
  linkId: string;
};
