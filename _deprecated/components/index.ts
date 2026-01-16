/**
 * Component Library Index
 *
 * Re-exports all components for easy importing.
 */

// =============================================================================
// PRIMITIVES
// =============================================================================

export {
  Button,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Chip,
  ChipGroup,
  Heading,
  Text,
  H1,
  H2,
  H3,
  H4,
  H5,
  H6,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableHeaderCell,
} from './primitives';

export type {
  ButtonProps,
  ButtonVariant,
  ButtonSize,
  CardProps,
  CardVariant,
  CardHeaderProps,
  CardBodyProps,
  CardFooterProps,
  ChipProps,
  ChipVariant,
  ChipSize,
  ChipGroupProps,
  HeadingProps,
  TextProps,
  HeadingLevel,
  TextVariant,
  TextColor,
  TableProps,
  TableHeadProps,
  TableBodyProps,
  TableRowProps,
  TableCellProps,
  TableHeaderCellProps,
} from './primitives';

// =============================================================================
// DOMAIN COMPONENTS
// =============================================================================

export {
  StrainCard,
  ProductCard,
  PharmacyCard,
  OfferTable,
  PriceSummary,
  TerpeneProfile,
  TerpeneWheel,
} from './domain';

export type {
  StrainCardProps,
  ProductCardProps,
  PharmacyCardProps,
  OfferTableProps,
  OfferWithPharmacy,
  PriceSummaryProps,
  TerpeneProfileProps,
  TerpeneData,
  TerpeneWheelProps,
} from './domain';

// =============================================================================
// LAYOUT COMPONENTS
// =============================================================================

export {
  Container,
  Grid,
  GridItem,
  Stack,
  AutoGrid,
  PageLayout,
  Header,
  Main,
  Footer,
  Breadcrumb,
  PageHeader,
} from './layout';

export type {
  ContainerProps,
  GridProps,
  GridItemProps,
  StackProps,
  AutoGridProps,
  GridColumns,
  GridGap,
  PageLayoutProps,
  HeaderProps,
  MainProps,
  FooterProps,
  BreadcrumbProps,
  PageHeaderProps,
} from './layout';
