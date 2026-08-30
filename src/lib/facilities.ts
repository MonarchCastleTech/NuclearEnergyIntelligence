import reactors from '../data/reactors.json';
import chokepoints from '../data/chokepoints.json';

export type ReactorFacility = (typeof reactors)[number];
export type ChokepointFacility = (typeof chokepoints)[number];
export type SelectedFacility = ReactorFacility | ChokepointFacility;
