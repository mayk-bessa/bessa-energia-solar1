export type ProposalComponent = {
  id: string;
  name: string;
  quantity: number;
  unitPrice: number;
};

export function calculateLineTotal(component: ProposalComponent): number {
  return Math.max(0, component.quantity) * Math.max(0, component.unitPrice);
}

export function calculateProposalTotal(components: ProposalComponent[]): number {
  return components.reduce((total, component) => total + calculateLineTotal(component), 0);
}
