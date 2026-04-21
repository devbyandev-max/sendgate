<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}" class="dark">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">

        {{-- SendGate is dark-mode only. Set the background immediately to avoid
             any flash of unstyled content on first paint. --}}
        <style>
            html {
                background-color: oklch(0.145 0 0);
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
