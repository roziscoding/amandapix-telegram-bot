import { User } from "../deps.ts";

type Member = { id: number; username?: string; firstName: string };

type Debt = {
  to: Member;
  amount: number;
};

export type SerializedGroup = {
  members: [number, Member][];
  debts: [number, Debt[]][];
};

const userToMember = (user: User) => ({ id: user.id, username: user.username, firstName: user.first_name });

export class Group {
  #members: Map<number, Member> = new Map();
  #debts: Map<number, Debt[]> = new Map();

  static hydrate(serializedGroup: SerializedGroup) {
    const group = new Group();
    group.#members = new Map(serializedGroup.members);
    group.#debts = new Map(serializedGroup.debts);
    return group;
  }

  serialize(): SerializedGroup {
    return {
      members: [...this.#members.entries()],
      debts: [...this.#debts.entries()],
    };
  }

  static get empty(): SerializedGroup {
    return {
      members: [],
      debts: [],
    };
  }

  addMember(user: User) {
    this.#members.set(user.id, { id: user.id, username: user.username, firstName: user.first_name });
  }

  removeMember(user: User) {
    this.#members.delete(user.id);
  }

  addDebt(from: User | Member, to: User, amount: number) {
    if (from.id === to.id) return;
    if (!this.#members.has(from.id)) throw new Error("from user is not a member");

    const debts = this.#debts.get(from.id) ?? [];
    debts.push({ to: userToMember(to), amount });
    this.#debts.set(from.id, debts);
  }

  removeDebt(from: User, to: User) {
    if (!this.#members.has(from.id)) throw new Error("from user is not a member");
    const debts = this.#debts.get(from.id) ?? [];
    this.#debts.set(from.id, debts.filter((debt) => debt.to.id !== to.id));
  }

  getDebts(from: User) {
    if (!this.#members.has(from.id)) throw new Error("from user is not a member");
    return this.#debts.get(from.id) ?? [];
  }

  addExpense(user: User, amount: number) {
    if (!this.#members.has(user.id)) throw new Error("from user is not a member");
    const amountPerMember = amount / (this.#members.size);
    for (const member of this.#members.values()) this.addDebt(member, user, amountPerMember);
  }

  getAllDebts() {
    const debts: Array<Debt & { from: Member }> = [];
    for (const [from, debtsFrom] of this.#debts.entries()) {
      for (const debt of debtsFrom) {
        debts.push({ ...debt, from: this.#members.get(from)! });
      }
    }
    return debts;
  }

  has(user: User) {
    return this.#members.has(user.id);
  }

  get members() {
    return [...this.#members.values()];
  }
}
