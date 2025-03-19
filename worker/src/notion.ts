import { Client } from "@notionhq/client"
import { config } from "dotenv"

config()

const pageId = process.env.NOTION_PAGE_ID
const apiKey = process.env.NOTION_API_KEY

const notion = new Client({ auth: apiKey })


/////////////////////////////////////////////////////////////

export async function notionfxn(meta:any) {
  const blockId = pageId // Blocks can be appended to other blocks *or* pages. Therefore, a page ID can be used for the block_id parameter
  const newHeadingResponse = await notion.blocks.children.append({
    block_id: blockId||"",
    // Pass an array of blocks to append to the page: https://developers.notion.com/reference/block#block-type-objects
    children: [
      {
        heading_2: {
          rich_text: [
            {
              text: {
                content: meta.text, // This is the text that will be displayed in Notion
              },
            },
          ],
        },
      },
    ],
  })

  // Print the new block(s) response
  console.log(newHeadingResponse)
}

//////////////////////////////////////////////////





