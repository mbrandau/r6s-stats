const axios = require('axios');
const {generalOperatorStatistics, operatorOrganisations, allStatistics} = require('./constants');
const fromEntries = require('object.fromentries');

class R6sStats {

    constructor(email, password) {
        this.credentials = Buffer.from(`${email}:${password}`).toString('base64')
    }

    async init() {
        const homePageContent = (await axios("https://game-rainbow6.ubi.com/en-us/home")).data;
        const mainScriptHash = /main(.+)js/.exec(homePageContent)[1];
        const mainScriptContent = (await axios(`https://game-rainbow6.ubi.com/assets/scripts/main${mainScriptHash}js`)).data;
        const baseUrl = 'https://game-rainbow6.ubi.com/';

        const operatorsHash = /assets\/data\/operators(.+?)json/.exec(mainScriptContent)[1];
        const operators = (await axios(`https://game-rainbow6.ubi.com/assets/data/operators${operatorsHash}json`)).data;
        this.operators = Object.values(operators)
            .map(operator => ({
                ...operator,
                figure: {
                    small: baseUrl + operator.figure.small,
                    large: baseUrl + operator.figure.large
                },
                mask: baseUrl + operator.mask,
                badge: baseUrl + operator.badge,
                organisation: operatorOrganisations[operator.id].organisation,
                name: operatorOrganisations[operator.id].name
            }));

        const ranksHash = /assets\/data\/ranks(.+?)json/.exec(mainScriptContent)[1];
        const {seasons} = (await axios(`https://game-rainbow6.ubi.com/assets/data/ranks${ranksHash}json`)).data;
        this.seasons = seasons.map(season => {
            return {
                ...season,
                ranks: season.ranks.map(rank => {
                    return {
                        ...rank,
                        images: fromEntries(Object.entries(rank.images).map(([key, path]) => [key, `${baseUrl}${path}`]))
                    }
                })
            }
        });
    }

    async login() {
        const ubiAppId = '39baebad-39e5-4552-8c25-2c9b919064e2';
        this.ticket = (await axios.post('https://public-ubiservices.ubi.com/v3/profiles/sessions', {"rememberMe": true},
            {
                headers: {
                    'Ubi-AppId': ubiAppId,
                    'Ubi-RequestedPlatformType': 'uplay',
                    'Authorization': `Basic ${this.credentials}`,
                    'X-Requested-With': 'XMLHttpRequest',
                    'Referer': `https://public-ubiservices.ubi.com/Default/Login?appId=${ubiAppId}&lang=en-US&nextUrl=https%3A%2F%2Fclub.ubisoft.com%2Flogged-in.html%3Flocale%3Den-US`,
                }
            })).data;
    }

    async getTicket(check = true) {
        if (!this.ticket) {
            await this.login();
            return this.getTicket(false)
        }
        if ((!this.ticket.expiration || this.ticket.error && this.ticket.error === true || this.ticket.errorCode) && check) {
            await this.login();
            return this.getTicket(false);
        } else if (check) {
            const d = new Date(this.ticket.expiration);
            if (d.getTime() < new Date().getTime()) {
                await this.login();
                return this.getTicket(false)
            }
        }
        if (!this.ticket.ticket) return '';

        return `Ubi_v1 t=${this.ticket.ticket}`;
    }

    async searchUserByName(name, platform = 'uplay') {
        return this.getProfile(`nameOnPlatform=${encodeURIComponent(name)}&platformType=${platform}`)
    }

    async searchUserByProfileId(profileId) {
        return this.getProfile(`profileId=${profileId}`)
    }

    async getProfile(params) {
        const baseUrl = 'https://api-ubiservices.ubi.com/v2/profiles?';
        const {profiles} = (await axios(`${baseUrl}${params}`,
            {
                headers: {
                    'Ubi-AppId': '314d4fef-e568-454a-ae06-43e3bece12a6',
                    'Ubi-SessionId': 'a651a618-bead-4732-b929-4a9488a21d27',
                    'Authorization': await this.getTicket(),
                    'Referer': 'https://club.ubisoft.com/en-US/friends',
                    'Accept-Language': 'en-US',
                    'Origin': 'https://club.ubisoft.com',
                }
            })).data;
        if (!profiles || profiles.length === 0) return null;
        return profiles[0];
    }

    async getStatistics(playerIds, stats, platform = 'uplay') {
        const user = playerIds[0];
        const requestUrls = {
            "uplay":
                "https://public-ubiservices.ubi.com/v1/spaces/5172a557-50b5-4665-b7db-e3f2e8c5041d/sandboxes/OSBOR_PC_LNCH_A/playerstats2/statistics",
            "xbl":
                "https://public-ubiservices.ubi.com/v1/spaces/98a601e5-ca91-4440-b1c5-753f601a2c90/sandboxes/OSBOR_XBOXONE_LNCH_A/playerstats2/statistics",
            "psn":
                "https://public-ubiservices.ubi.com/v1/spaces/05bfb3f7-6c21-4c42-be1f-97a33fb5cf66/sandboxes/OSBOR_PS4_LNCH_A/playerstats2/statistics"
        };

        const requestUrl = `${requestUrls[platform]}?populations=${playerIds.join(',')}&statistics=${stats.join(',')}`;

        const {results} = (await axios(requestUrl,
            {
                headers: {
                    'Ubi-AppId': '39baebad-39e5-4552-8c25-2c9b919064e2',
                    'Ubi-SessionId': 'a4df2e5c-7fee-41ff-afe5-9d79e68e8048',
                    'Authorization': await this.getTicket(),
                    'Referer': `https://game-rainbow6.ubi.com/de-de/uplay/player-statistics/${user}/multiplayer`,
                    'Accept-Language': 'en-US',
                    'Origin': 'https://game-rainbow6.ubi.com',
                }
            })).data;

        return fromEntries(Object.entries(results).map(([playerId, statistics]) => {
            return [playerId, fromEntries(Object.entries(statistics).map(([key, value]) => {
                return [key.replace(':infinite', ''), value]
            }))]
        }))
    }

    getOperatorUniqueStatistics() {
        return this.operators
            .map(op => op.uniqueStatistic.pvp)
            .filter(pvp => !!pvp)
            .map(pvp => pvp.statisticId);
    }

    async getOperators(playerIds, platform = 'uplay') {
        const results = await this.getStatistics(playerIds, [...generalOperatorStatistics, ...this.getOperatorUniqueStatistics()], platform);
        return this.formatOperatorStatistics(results)
    }

    formatOperatorStatistics(statistics) {
        const rs = {};
        Object.entries(statistics).forEach(([playerId, statistics]) => rs[playerId] = this.operators.map(op => {
            const opStats = {};

            const specificKey = op.uniqueStatistic.pvp && op.uniqueStatistic.pvp.statisticId;
            generalOperatorStatistics.forEach(key => opStats[key] = statistics[`${key}:${op.index}`] || 0);
            if (specificKey) opStats[specificKey] = statistics[specificKey] || 0;
            Object.entries(statistics).forEach(([key, value]) => {
                if (key.split(':', 2)[1] === op.index) opStats[key] = value
            });

            return {
                operator: op,
                statistics: opStats
            }
        }));
        return rs;
    }

    async getRanking(playerIds, season = -1, region = 'emea', platform = 'uplay') {
        const user = playerIds[0];
        const requestUrls = {
            "uplay":
                "https://public-ubiservices.ubi.com/v1/spaces/5172a557-50b5-4665-b7db-e3f2e8c5041d/sandboxes/OSBOR_PC_LNCH_A/r6karma/players",
            "xbl":
                "https://public-ubiservices.ubi.com/v1/spaces/98a601e5-ca91-4440-b1c5-753f601a2c90/sandboxes/OSBOR_XBOXONE_LNCH_A/r6karma/players",
            "psn":
                "https://public-ubiservices.ubi.com/v1/spaces/05bfb3f7-6c21-4c42-be1f-97a33fb5cf66/sandboxes/OSBOR_PS4_LNCH_A/r6karma/players"
        };
        const requestUrl = `${requestUrls[platform]}?board_id=pvp_ranked&profile_ids=${playerIds.join(',')}&region_id=${region}&season_id=${season}`;

        const {players} = (await axios(requestUrl,
            {
                headers: {
                    'Ubi-AppId': '39baebad-39e5-4552-8c25-2c9b919064e2',
                    'Ubi-SessionId': 'a4df2e5c-7fee-41ff-afe5-9d79e68e8048',
                    'Authorization': await this.getTicket(),
                    'Referer': `https://game-rainbow6.ubi.com/de-de/uplay/player-statistics/${user}/multiplayer`,
                    'Accept-Language': 'en-US',
                    'Origin': 'https://game-rainbow6.ubi.com',
                }
            })).data;

        return fromEntries(Object.entries(players).map(([playerId, rankInfo]) => {
            const season = this.seasons.find(s => s.id === rankInfo.season);
            const {images} = season.ranks[rankInfo.rank];
            return [playerId, {...rankInfo, image: images.hd || images.default}]
        }));
    }

    async getProgression(playerIds, platform = 'uplay') {
        const user = playerIds[0];
        const requestUrls = {
            "uplay":
                "https://public-ubiservices.ubi.com/v1/spaces/5172a557-50b5-4665-b7db-e3f2e8c5041d/sandboxes/OSBOR_PC_LNCH_A/r6playerprofile/playerprofile/progressions",
            "xbl":
                "https://public-ubiservices.ubi.com/v1/spaces/98a601e5-ca91-4440-b1c5-753f601a2c90/sandboxes/OSBOR_XBOXONE_LNCH_A/r6playerprofile/playerprofile/progressions",
            "psn":
                "https://public-ubiservices.ubi.com/v1/spaces/05bfb3f7-6c21-4c42-be1f-97a33fb5cf66/sandboxes/OSBOR_PS4_LNCH_A/r6playerprofile/playerprofile/progressions"
        };

        const requestUrl = `${requestUrls[platform]}?profile_ids=${playerIds.join(',')}`;
        return (await axios(requestUrl,
            {
                headers: {
                    'Ubi-AppId': '39baebad-39e5-4552-8c25-2c9b919064e2',
                    'Ubi-SessionId': 'a4df2e5c-7fee-41ff-afe5-9d79e68e8048',
                    'Authorization': await this.getTicket(),
                    'Referer': `https://game-rainbow6.ubi.com/de-de/uplay/player-statistics/${user}/multiplayer`,
                    'Accept-Language': 'en-US',
                    'Origin': 'https://game-rainbow6.ubi.com',
                }
            })).data.player_profiles;
    }

    async getAllStatistics(playerIds, region = 'emea', season = -1, platform = 'uplay') {
        playerIds = playerIds.map(id=>id.toLowerCase());
        const results = {};
        const [
            progressions,
            rankInfo,
            statistics
        ] = await Promise.all([
            this.getProgression(playerIds, platform),
            this.getRanking(playerIds, season, region, platform),
            this.getStatistics(playerIds, allStatistics, platform)
        ]);
        const operators = this.formatOperatorStatistics(statistics);

        playerIds.forEach(id => {
            results[id] = {
                operators: operators[id],
                progression: progressions.find(p => p.profile_id === id),
                rank: rankInfo[id],
                statistics: fromEntries(
                    Object.entries(statistics[id])
                        .filter(([key]) => !key.startsWith("operatorpvp_"))
                )
            }
        });
        return results;
    }

}

module.exports = R6sStats;