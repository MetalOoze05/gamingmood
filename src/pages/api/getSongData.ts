import { type NextApiRequest, type NextApiResponse } from "next";

import { getYtSong } from "../../utils/ytsr";

type Res = {
    video?: {
        id: string,
        title: string,
        duration: string,
        uploadedAt: string,

        thumbnail: {
            id: string,
            width: number,
            height: number,
            url: string
        },

        channel: {
            name: string,
            id: string
        }
    }
};

export default async ( req: NextApiRequest, res: NextApiResponse<Res>) => {
    const { query } = req.query;
    const data = await getYtSong(query as string);

    // const obj: Res = {
    //     video: {
    //         id: data.video.id as string,
    //         title: data.video.title as string,
    //         duration: data.video.duration as unknown as string,
    //         uploadedAt: data.video.uploadedAt as string,

    //         thumbnail: {
    //             id: data.video.thumbnail?.id as string,
    //             width: data.video.thumbnail?.width as number,
    //             height: data.video.thumbnail?.height as number,
    //             url: data.video.thumbnail?.url as string,
    //         },

    //         channel: {
    //             name: data.video.channel?.name as string,
    //             id: data.video.channel?.id as string
    //         }

    //     }
    // }
    
    res.status(200).json({
        video: {
            id: data.video.id as string,
            title: data.video.title as string,
            duration: data.video.duration as unknown as string,
            uploadedAt: data.video.uploadedAt as string,

            thumbnail: {
                id: data.video.thumbnail?.id as string,
                width: data.video.thumbnail?.width as number,
                height: data.video.thumbnail?.height as number,
                url: data.video.thumbnail?.url as string,
            },

            channel: {
                name: data.video.channel?.name as string,
                id: data.video.channel?.id as string
            }

        }
    });
}