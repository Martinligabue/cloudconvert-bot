import d from 'debug';
import { ExtraReplyMessage } from 'telegraf/typings/telegram-types';
import * as strings from '../../strings';
import * as util from '../helpers/get-file-extension';
import { cancelOperationReplyMarkup } from '../helpers/reply-markup-builder';
import TaskContext from '../models/task-context';
import * as cloudconvert from './../models/cloud-convert';
const debug = d('bot:contr:util');

export async function printPossibleConversions(ctx: TaskContext, fileId: string): Promise<void> {
    let fileUrl: string;
    try {
        fileUrl = await ctx.telegram.getFileLink(fileId);
    } catch (e) {
        if (e.code === 400) {
            await ctx.reply(strings.fileTooBig);
        } else {
            d('err')(e);
            await ctx.reply(strings.unknownError);
        }
        return;
    }
    const ext = util.ext(fileUrl);
    const formats = await cloudconvert.listPossibleConversions(ext);

    let msg;
    if (formats.length > 0) {
        // group formats by category
        const categories = formats.map(f => f.group).filter(uniques);
        msg = 'Awesome! I can convert this ' + ext + ' to:\n'
            + categories.map(cat =>
                '<b>' + cat + '</b>\n'
                + formats.filter(f => f.group === cat)
                    .map(f => '/' + f.outputformat.replace(/[\s\.]/g, '_')
                        + ' (<i>' + f.outputformat + '</i>)')
                    .join('\n'),
            ).join('\n\n');
    } else {
        msg = 'I cannot convert files of type <b>' + ext + '</b>! Sorry!';
    }

    const extra: ExtraReplyMessage = {
        reply_markup: cancelOperationReplyMarkup,
    };
    if (ctx.message !== undefined && ctx.message.chat.type !== 'private') {
        extra.reply_to_message_id = ctx.message.message_id;
    }
    await ctx.replyWithHTML(msg, extra);
}

export async function getFileIdFromReply(ctx: TaskContext, usageHelp?: string)
    : Promise<{ file_id: string, file_name?: string } | undefined> {
    if (ctx.message !== undefined) {
        if (ctx.message.reply_to_message === undefined) {
            if (usageHelp) {
                await ctx.reply(usageHelp, { reply_to_message_id: ctx.message.message_id });
            }
        } else {
            const reply = ctx.message.reply_to_message;
            let file: { file_id: string, file_name?: string } | undefined
                = reply.audio || reply.document || reply.sticker || reply.video || reply.voice || reply.video_note;
            if (file === undefined && reply.photo !== undefined) {
                file = reply.photo[reply.photo.length - 1];
            }
            if (file === undefined) {
                if (usageHelp) {
                    await ctx.reply(usageHelp, { reply_to_message_id: ctx.message.message_id });
                }
            } else {
                return file;
            }
        }
    }
    return undefined;
}

// Helper function to get unique values in array
function uniques<E>(element: E, index: number, array: E[]) {
    return array.indexOf(element) === index;
}
