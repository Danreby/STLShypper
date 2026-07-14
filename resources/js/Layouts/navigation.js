import { Calculator, Layers, LayoutDashboard, Package, Printer, Settings } from 'lucide-react';

export const navigation = [
    { name: 'Resumo', routeName: 'dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Produtos', routeName: 'products.index', href: '/produtos', icon: Package },
    { name: 'Calculadora', routeName: 'calculator.index', href: '/calculadora', icon: Calculator },
    { name: 'Impressoras', routeName: 'printers.index', href: '/impressoras', icon: Printer },
    { name: 'Materiais', routeName: 'materials.index', href: '/materiais', icon: Layers },
    { name: 'Parâmetros', routeName: 'settings.edit', href: '/parametros', icon: Settings },
];
