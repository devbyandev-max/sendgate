<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}" @class(['dark' => ($appearance ?? 'dark') === 'dark'])>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">

        {{-- Inline script: when appearance is "system", resolve against the OS preference
             BEFORE any stylesheet paints, so there's no flash of wrong theme. --}}
        <script>
            (function() {
                var appearance = '{{ $appearance ?? "dark" }}';
                if (appearance === 'system') {
                    var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                    if (prefersDark) document.documentElement.classList.add('dark');
                }
            })();
        </script>

        {{-- Inline style sets the html background so the viewport never flashes wrong.
             Tokens mirror the ones in resources/css/app.css. --}}
        <style>
            html {
                background-color: oklch(1 0 0);
                color-scheme: light;
            }
            html.dark {
                background-color: oklch(0.12 0.005 286);
                color-scheme: dark;
            }
        </style>

        <link rel="icon" href="/favicon-32.png" sizes="32x32" type="image/png">
        <link rel="icon" href="/favicon-16.png" sizes="16x16" type="image/png">
        <link rel="icon" href="/favicon-256.png" sizes="256x256" type="image/png">
        <link rel="apple-touch-icon" href="/apple-touch-icon.png">

        @viteReactRefresh
        @vite(['resources/css/app.css', 'resources/js/app.tsx', "resources/js/pages/{$page['component']}.tsx"])
        <x-inertia::head>
            <title>{{ config('app.name', 'Laravel') }}</title>
        </x-inertia::head>
    </head>
    <body class="font-sans antialiased">
        <x-inertia::app />
    </body>
</html>
