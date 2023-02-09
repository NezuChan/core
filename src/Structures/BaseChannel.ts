import { APIChannel, ChannelFlags, ChannelType, RESTPostAPIChannelMessageJSONBody } from "discord-api-types/v10";
import { Base } from "./Base";
import { Message } from "./Message";
import { TextChannel } from "./TextChannel";
import { VoiceChannel } from "./VoiceChannel";

export class BaseChannel extends Base<APIChannel> {
    public get guildId(): string {
        return this.guildId;
    }

    public get name(): string {
        return this.name;
    }

    public get type(): ChannelType {
        return this.data.type;
    }

    public get flags(): ChannelFlags | undefined {
        return this.data.flags;
    }

    public async send(options: RESTPostAPIChannelMessageJSONBody): Promise<Message> {
        return this.client.sendMessage(options, this.id);
    }

    public isVoice(): this is VoiceChannel {
        return this.type === ChannelType.GuildVoice;
    }

    public isText(): this is TextChannel {
        return ![
            ChannelType.GuildStageVoice, ChannelType.GuildVoice
        ].includes(this.type);
    }

    public isSendable(): boolean {
        return ![ChannelType.GuildCategory, ChannelType.GuildDirectory, ChannelType.GuildForum, ChannelType.GuildStageVoice].includes(this.type);
    }
}
