interface TNavItemBadge {
    show: Boolean,
    color: String,
    content: String,
}

export default interface TNavItem {
    title: String,
    route: String,
    prependIcon: String,
    color: String,
    value: String,
    active: Boolean,
    badge: TNavItemBadge,
}