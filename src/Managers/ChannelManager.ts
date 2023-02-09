import { APIChannel, ChannelType } from "discord-api-types/v10";
import { BaseManager } from "./BaseManager";
import { Client } from "../Structures/Client";
import { RedisCollection } from "@nezuchan/redis-collection";
import { MakeCacheNameFunction } from "../Utilities/Functions";
import { KeyConstants } from "../Utilities/Enums/KeyConstants";
import { BaseChannel } from "../Structures/BaseChannel";
import { VoiceChannel } from "../Structures/VoiceChannel";
import { TextChannel } from "../Structures/TextChannel";

export class ChannelManager extends BaseManager<APIChannel, BaseChannel | TextChannel | VoiceChannel> {
    public constructor(
        client: Client
    ) {
        super(
            KeyConstants.CHANNEL_KEY,
            client
        );
    }

    public override makeCache(): RedisCollection<APIChannel, BaseChannel | TextChannel | VoiceChannel> {
        return new RedisCollection({
            hash: MakeCacheNameFunction(this.name, this.client.options.clientId!, this.client.options.gatewayRouting ?? false),
            redis: this.client.redis,
            deserialize: value => {
                const parsedValue = JSON.parse(value as string) as APIChannel;
                switch (parsedValue.type) {
                    case ChannelType.GuildVoice:
                    case ChannelType.GuildStageVoice:
                        return new VoiceChannel(parsedValue, this.client);
                    default:
                        return new TextChannel(parsedValue, this.client);
                }
            },
            serialize: value => JSON.stringify(value)
        });
    }

    public override _patch(old: BaseChannel | TextChannel | VoiceChannel, data: APIChannel): APIChannel {
        return data;
    }
}
