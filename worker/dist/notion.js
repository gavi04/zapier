"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.notionfxn = void 0;
const client_1 = require("@notionhq/client");
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
const pageId = process.env.NOTION_PAGE_ID;
const apiKey = process.env.NOTION_API_KEY;
const notion = new client_1.Client({ auth: apiKey });
/////////////////////////////////////////////////////////////
function notionfxn(meta) {
    return __awaiter(this, void 0, void 0, function* () {
        const blockId = pageId; // Blocks can be appended to other blocks *or* pages. Therefore, a page ID can be used for the block_id parameter
        const newHeadingResponse = yield notion.blocks.children.append({
            block_id: blockId || "",
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
        });
        // Print the new block(s) response
        console.log(newHeadingResponse);
    });
}
exports.notionfxn = notionfxn;
//////////////////////////////////////////////////
