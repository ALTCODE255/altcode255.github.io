function setHeader() {
    document.getElementById("header").innerHTML = `
        <nav class="navbar navbar-expand-md navbar-dark">
            <div class="container-fluid">
                <ul class="navbar-nav justify-content-center w-100">
                    <li class="nav-item">
                        <a class="nav-link" href="/">Home</a>
                    </li>
                    <li class="nav-item dropdown">
                        <a class="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                            Projects
                        </a>
                        <ul class="dropdown-menu" aria-labelledby="navbarDropdown">
                            <li><a class="dropdown-item" href="/coding">Coding Projects</a></li>
                            <li><a class="dropdown-item" href="/bots">Twitter/Bluesky Bots</a></li>
                            <li><a class="dropdown-item" href="/counter">S Tally Counter</a></li>
                        </ul>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="/writing">Writing</a>
                    </li>
                    <li class="nav-item dropdown">
                        <a class="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                            Shuuenpro Stuff
                        </a>
                        <ul class="dropdown-menu" aria-labelledby="navbarDropdown">
                            <li><a class="dropdown-item" href="/shuuenpro">Directory</a></li>
                            <li><a class="dropdown-item" href="https://shuuenpro.github.io">Nameless Shuuen no Shiori Guide</a></li>
                            <li><a class="dropdown-item" href="/weekofdemise">Week of Demise (Art Week)</a></li>
                        </ul>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="/akc">Akechi Archive</a>
                    </li>
                </ul>
            </div>
        </nav>
    `;
}

function setActive() {
    if (location.host == "altcode255.github.io") {
        href = location.pathname.replace(".html", "");
    } else {
        href = "/" + location.href.split("/").slice(-1)[0].replace(".html", "");
        if (href == "/index") {
            href = "/";
        }
    }
    let match = document.querySelectorAll(`header a[href="${href}"`)[0];
    match.classList.add("active");
}

setHeader();
setActive();
