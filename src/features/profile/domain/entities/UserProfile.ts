interface UserProfileProps {
  id: string;
  firstName: string;
  lastName: string | null;
  avatarUrl: string | null;
  courses: string[];
  createdAt: Date;
  onboardingCompletedAt: Date | null;
  role: string;
  updatedAt: Date | null;
}

export class UserProfile {
  constructor(private readonly props: UserProfileProps) {}
  get id() {
    return this.props.id;
  }

  get firstName() {
    return this.props.firstName;
  }
  get avatarUrl() {
    return this.props.avatarUrl;
  }

  get lastName() {
    return this.props.lastName;
  }

  get courses() {
    return this.props.courses;
  }

  get createdAt() {
    return this.props.createdAt;
  }

  get updatedAt() {
    return this.props.updatedAt;
  }

  get onboardingCompletedAt() {
    return this.props.onboardingCompletedAt;
  }

  get role() {
    return this.props.role;
  }
}
