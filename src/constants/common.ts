export const tlpOptions = ['WHITE', 'GREEN', 'AMBER', 'RED'];

export const incidentStatusOptions = [
  'NEW',
  'OPEN',
  'PENDING',
  'ESCALATED',
  'CLOSED',
];

export const indicatorStatusOptions = [
  'OTHER',
  'USER',
  'NETWORK',
  'FILE',
  'PROCESS',
  'ENDPOINT',
  'EVENT',
  'ALERT',
  'EXECUTION',
  'COMMAND_EXECUTION',
];

export const indicatorClassificationOptions = [
  'UNCLASSIFIED',
  'MALICIOUS',
  'SUSPICIOUS',
  'CLEAN',
  'FALSE POSITIVE',
  'INTERNAL ACTIVITY',
  'INCONCLUSIVE',
];

export const priorities = ['Lowest', 'Low', 'Medium', 'High', 'Highest'];

export const timeFrames = [
  'today',
  'last week',
  'last month',
  'last year',
  'all time',
];

export const chartsBgColors = [
  'rgba(75, 192, 192, 0.6)', // Teal
  'rgba(0, 200, 83, 0.6)', // Green
  'rgba(63, 81, 181, 0.6)', // Indigo
  'rgba(255, 99, 132, 0.6)', // Red
  'rgba(54, 162, 235, 0.6)', // Blue
  'rgba(134,255,86,0.6)', // Light green
  'rgba(153, 102, 255, 0.6)', // Purple
  'rgba(255, 159, 64, 0.6)', // Orange
  'rgba(201, 203, 207, 0.6)', // Grey
  'rgba(233, 30, 99, 0.6)', // Pink
];

export const assetStatusOptions = [
  'NEW',
  'CLEAN',
  'SUSPECTED',
  'COMPROMISED',
  'UNDER INVESTIGATION',
  'FALSE POSITIVE',
];
export const osOptions = ['WINDOWS', 'MACOS', 'LINUX', 'OTHER'];
export const attackPhaseOptions = [
  'PREPARATION',
  'INITIAL_ACCESS',
  'DELIVERY',
  'EXECUTION',
  'PERSISTENCE',
  'PRIV_ESCALATION',
  'DEFENSE_EVASION',
  'CREDENTIAL_ACCESS',
  'DISCOVERY',
  'LATERAL_MOVEMENT',
  'COLLECTION',
  'EXFILTRATION',
  'COMMAND_AND_CONTROL',
  'IMPACT',
  'CONTAINMENT',
  'ERADICATION',
  'RECOVERY',
];

export const linkTypeOptions = [
  'RELATED',
  'IMPACTED',
  'EXECUTED',
  'FILE',
  'PROCESS',
  'ENDPOINT',
  'OTHER',
];
