export type ChartType = "pie" | "line" | "bar" | "area";

export type DashboardModel = {
    current: DashboardItem | undefined
    items: { [id: symbol]: DashboardItem };
    layouts: Layouts
}

export type DashboardItem = {
    id: string
    title: string
    type: ChartType
    data: any[]
}

type Layout = {
    w: number
    h: number
    x: number
    y: number
    i: string
}

export type Layouts = {
    [key: symbol]: Layout
}
