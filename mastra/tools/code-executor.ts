import { createTool } from '@mastra/core/tools';
import { z } from 'zod';

 

const CodeExecutorResponseZod = z.object({
  script: z.string().describe('python script'),
});
export const CodeExecutorArgsZod = z.object({
  script: z.string().describe('python script'),
  columns: z.array(z.string()).describe('需要处理的列'),
});
export type CodeExecutorArgs = z.infer<typeof CodeExecutorArgsZod>;

export type CodeExecutorResponse = z.infer<typeof CodeExecutorResponseZod>;
export const codeExecutorTool = createTool({
  id: 'python-code-executor',
  description: '创建python脚本，注意你只能使用单文件处理，并且你只能使用pandas库',
  inputSchema:CodeExecutorArgsZod,
  outputSchema: CodeExecutorResponseZod,
  execute: async ({context}) => {
    return {
      script: context.script
    }
  }
});

 
