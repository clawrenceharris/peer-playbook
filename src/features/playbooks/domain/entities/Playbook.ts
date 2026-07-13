import { PlaybookStrategyCardDTO } from "../../application/dto";

export type PlaybookProps = {
  id: string;
  title: string;
  topic: string;
  courseName: string | null;
  subject: string | null;
  createdBy: string | null;
  createdAt: Date;
  strategies: PlaybookStrategyCardDTO[];
};

export class Playbook {
  constructor(public readonly props: PlaybookProps) {}

  get id() {
    return this.props.id;
  }

  get topic() {
    return this.props.topic;
  }

  get title() {
    return this.props.title;
  }

  get courseName() {
    return this.props.courseName;
  }

  get subject() {
    return this.props.subject;
  }

  get createdBy() {
    return this.props.createdBy;
  }

  get createdAt() {
    return this.props.createdAt;
  }
  get strategies() {
    return this.props.strategies;
  }

  withStrategies(strategies: PlaybookStrategyCardDTO[]) {
    return new Playbook({
      ...this.props,
      strategies,
    });
  }

  static create(props: PlaybookProps) {
    return new Playbook(props);
  }
}
