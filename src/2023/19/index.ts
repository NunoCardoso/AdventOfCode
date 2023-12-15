import { Params } from 'aoc.d'

type Decision = 'A' | 'R'
type Name = string
type Workflow =
  | {
      test: {
        key: string
        op: string
        val: number
      }
      success: Workflow
      failure: Workflow
    }
  | Decision
  | Name
type Part = {
  x?: number
  m?: number
  a?: number
  s?: number
}

type Part2 = Record<string, [number, number]>

export default async (lineReader: any, params: Params) => {
  const log = require('console-log-level')({ level: params.logLevel ?? 'info' })

  let part1: number = 0
  let part2: number = 0

  const workflows: Record<string, Workflow> = {}
  const parts: Array<Part> = []

  const processWorkflow = (workflowsDesc: string): Workflow => {
    if (workflowsDesc.indexOf(':') >= 0) {
      const m = workflowsDesc.match(/([^:]+):([^,]+),(.+)/)
      if (m && (m[1].match(/[<>]/)?.length ?? 0) >= 0) {
        const mm = m[1].match(/([^<>]+)([<>])(.+)/) // console.log('mm', mm)
        if (mm) {
          return {
            test: { key: mm[1], op: mm[2], val: +mm[3] },
            success: processWorkflow(m[2]),
            failure: processWorkflow(m[3])
          }
        }
      }
    }
    return workflowsDesc as Decision
  }

  for await (const line of lineReader) {
    if (line !== '') {
      if (!line.startsWith('{')) {
        const [, name, workflowsDesc] = line.match(/([^{]+)\{([^}]+)}/)
        workflows[name] = processWorkflow(workflowsDesc)
      } else {
        const part: Part = {}
        line
          .replaceAll(/[{}]/g, '')
          .split(',')
          .forEach((s: string) => {
            const [key, value] = s.split('=')
            // @ts-ignore
            part[key] = +value
          })
        parts.push(part)
      }
    }
  }

  const executeWorkflow = (part: Part, workflow: Workflow): Decision => {
    log.debug('executeWorkflow: part', part, 'workflow', workflow)
    // @ts-ignore
    const value = part[(workflow as Workflow).test.key]
    log.debug('test op', (workflow as any).test.op, 'value', value, 'val', (workflow as any).test.val)
    const res: Workflow =
      ((workflow as any).test.op === '>' && value - (workflow as any).test.val > 0) ||
      ((workflow as any).test.op === '<' && value - (workflow as any).test.val < 0)
        ? (workflow as any).success
        : (workflow as any).failure
    if (res === 'A' || res === 'R') return res
    if (typeof res === 'string') return executeWorkflow(part, workflows[res])
    return executeWorkflow(part, res)
  }

  const resolveWorkflow = (part: Part2, workflow: Workflow): number => {
    log.debug('resolveWorkflow', part, 'workflow', workflow)
    // let res: Array<[number, number]> = [] // success, failure
    if (workflow === 'A') {
      return (
        (part.x[1] - part.x[0] + 1) *
        (part.m[1] - part.m[0] + 1) *
        (part.a[1] - part.a[0] + 1) *
        (part.s[1] - part.s[0] + 1)
      )
    }
    if (workflow === 'R') {
      return 0
    }
    if (typeof workflow === 'string') {
      return resolveWorkflow(part, workflows[workflow])
    }

    const key = workflow.test.key
    const op = workflow.test.op
    const val = workflow.test.val
    const range = part[key]
    if (val < range[0] || val > range[1]) {
      if ((op === '<' && val > range[1]) || (op === '>' && val < range[0])) {
        return resolveWorkflow({ ...part }, workflow.success)
      }
    } else {
      if (op === '<') {
        // @ts-ignore
        // console.log('double range, run resolveWorkflow.success on key',key,'range',[range[0], val - 1],
        //  'resolveWorkflow.failure on key',key,'range',[val, range[1]])
        return (
          resolveWorkflow({ ...part, [key]: [range[0], val - 1] }, workflow.success) +
          resolveWorkflow({ ...part, [key]: [val, range[1]] }, workflow.failure)
        )
      } else {
        // console.log('double range, run resolveWorkflow.success on key',key,'range',[range[0], val - 1],
        //  'resolveWorkflow.failure on key',key,'range',[val, range[1]])
        return (
          resolveWorkflow({ ...part, [key]: [val + 1, range[1]] }, workflow.success) +
          resolveWorkflow({ ...part, [key]: [range[0], val] }, workflow.failure)
        )
      }
    }
    return 0
  }

  if (!params.skipPart1) {
    part1 = parts.reduce((acc: number, part: Part) => {
      return acc + (executeWorkflow(part, workflows.in) === 'A' ? part.m! + part.a! + part.s! + part.x! : 0)
    }, 0)
  }
  if (!params.skipPart2) {
    const part: Part2 = { x: [1, 4000], m: [1, 4000], a: [1, 4000], s: [1, 4000] }
    part2 = resolveWorkflow(part, workflows.in)
    // just sum the array ranges for x, m a and s, then multiply those 4 values
  }

  return { part1, part2 }
}
