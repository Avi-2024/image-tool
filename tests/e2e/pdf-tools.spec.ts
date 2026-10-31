import {test,expect} from '@playwright/test';
import {readFileSync} from 'node:fs';
import {PDFDocument} from 'pdf-lib';
import {unzipSync} from 'fflate';

test('images to PDF creates a genuine ordered two-page file locally',async({page})=>{
 const uploads:string[]=[];page.on('request',request=>{if(!['GET','HEAD'].includes(request.method()))uploads.push(request.url());});
 await page.goto('/image-to-pdf/');
 await page.getByLabel('Choose image files').setInputFiles(['tests/fixtures/photo.jpg','tests/fixtures/alpha.png']);
 await expect(page.locator('.pdf-file-list li')).toHaveCount(2);
 await page.getByRole('button',{name:'Create PDF'}).click();
 await expect(page.getByRole('button',{name:'Download PDF'})).toBeVisible();
 const pending=page.waitForEvent('download');await page.getByRole('button',{name:'Download PDF'}).click();
 const file=await pending,bytes=readFileSync((await file.path())!);
 expect(bytes.subarray(0,5).toString()).toBe('%PDF-');
 expect((await PDFDocument.load(bytes)).getPageCount()).toBe(2);
 expect(uploads).toEqual([]);
});

test('PDF to images renders real PNG pages and ZIP without uploading',async({page})=>{
 const uploads:string[]=[];page.on('request',request=>{if(!['GET','HEAD'].includes(request.method()))uploads.push(request.url());});
 await page.goto('/pdf-to-image/');
 await page.getByLabel('Choose PDF file').setInputFiles('tests/fixtures/two-pages.pdf');
 await expect(page.getByText('2 pages in this PDF')).toBeVisible();
 await page.getByRole('button',{name:'Convert pages'}).click();
 await expect(page.locator('.pdf-result-list li')).toHaveCount(2);
 const pending=page.waitForEvent('download');await page.getByRole('button',{name:'Download all · ZIP'}).click();
 const file=await pending,entries=unzipSync(readFileSync((await file.path())!));
 expect(Object.keys(entries)).toEqual(['page-1.png','page-2.png']);
 for(const bytes of Object.values(entries))expect([...bytes.slice(0,8)]).toEqual([137,80,78,71,13,10,26,10]);
 expect(uploads).toEqual([]);
});

test('mobile PDF flow fits the viewport in empty, selected and ready states',async({page},testInfo)=>{
 await page.setViewportSize({width:390,height:844});
 await page.goto('/image-to-pdf/');
 await page.screenshot({path:testInfo.outputPath('pdf-mobile-empty.png'),fullPage:true});
 await page.getByLabel('Choose image files').setInputFiles('tests/fixtures/photo.jpg');
 await expect(page.locator('.pdf-file-list li')).toHaveCount(1);
 await page.screenshot({path:testInfo.outputPath('pdf-mobile-selected.png'),fullPage:true});
 await page.getByRole('button',{name:'Create PDF'}).click();
 await expect(page.getByRole('button',{name:'Download PDF'})).toBeVisible();
 await page.screenshot({path:testInfo.outputPath('pdf-mobile-ready.png'),fullPage:true});
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
 await page.getByRole('button',{name:'Toggle color theme'}).click();
 await page.screenshot({path:testInfo.outputPath('pdf-mobile-dark.png'),fullPage:true});
});
