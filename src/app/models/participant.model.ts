export class ParticipantModel {
	public profileIconId: number;
	public championId: number;
	public summonerName: string;
	public perks: number;
	public bot: any;
	public spell2Id: number;
	public spell1Id: number;
	public teamId: number;
	public summonerId: number;

	constructor(fields: any) {
		for (var f in fields) {
			this[f] = fields[f];
		}
	}
}
