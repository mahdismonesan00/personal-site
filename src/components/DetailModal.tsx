import { PROJECTS } from "../data/profile";
import { CATEGORIES, serviceById } from "../data/services";
import { useI18n } from "../lib/i18n";
import { useStore } from "../lib/store";
import { Btn, Chip, HeartButton, Icon, Modal } from "./ui";
import { catColor, catIcon } from "./Services";

export default function DetailModal() {
  const { detail, closeDetail, openDetail, setWizardSeed, setDashTab, setRoute, setDraft, toast, askBot } = useStore();
  const { t, pick, fmt } = useI18n();

  const service = detail?.kind === "service" ? serviceById(detail.id) : undefined;
  const project = detail?.kind === "project" ? PROJECTS.find((p) => p.id === detail.id) : undefined;
  const open = Boolean(service || project);

  const cat = service?.cat ?? project?.cat ?? "web";
  const color = catColor(cat);
  const title = service ? pick(service.title) : project ? pick(project.name) : "";
  const img = service?.img ?? project?.img ?? "";
  const related = service ? PROJECTS.find((p) => p.serviceId === service.id) : undefined;
  const relatedService = project ? serviceById(project.serviceId) : undefined;

  const startProject = (serviceId: string) => {
    setWizardSeed(serviceId);
    setDashTab("wizard");
    closeDetail();
    setRoute("dashboard");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const requestSimilar = (text: string) => {
    setDraft({ topic: project?.serviceId ?? "", body: text });
    closeDetail();
    setRoute("site");
    toast(t("work.request"), "info");
    window.setTimeout(() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" }), 120);
  };

  return (
    <Modal open={open} onClose={closeDetail} wide>
      <div className="img-wrap relative h-56 w-full overflow-hidden sm:h-72">
        <img src={img} alt={title} className="img-grade h-full w-full object-cover" />
        <div className="absolute inset-x-0 bottom-0 z-10 p-5 sm:p-7">
          <span
            className="inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[11px] font-semibold backdrop-blur-md"
            style={{ borderColor: `${color}66`, background: `${color}22`, color }}
          >
            <Icon name={catIcon(cat)} className="h-3.5 w-3.5" />
            {pick(CATEGORIES.find((c) => c.id === cat)!.label)}
          </span>
          <h3 className="mt-3 font-display text-2xl font-bold leading-tight text-txt sm:text-3xl">{title}</h3>
          {service && <p className="mt-1.5 text-[13.5px]" style={{ color }}>{pick(service.tagline)}</p>}
        </div>
      </div>

      <div className="p-5 sm:p-7">
        <div className="flex flex-wrap items-center gap-3">
          <HeartButton id={detail?.id ?? ""} label={title} />
          <span className="text-[13px] text-muted">{t("services.fav")}</span>
          {service && (
            <span className="ms-auto inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/[0.03] px-3.5 py-2 font-mono text-[11.5px] text-muted">
              <Icon name="clock" className="h-4 w-4" />
              {t("services.delivery")}: {fmt(service.weeks[0])}–{fmt(service.weeks[1])} {t("unit.weeks")}
            </span>
          )}
          {project && (
            <span className="ms-auto inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/[0.03] px-3.5 py-2 font-mono text-[11.5px] text-muted">
              <Icon name="user" className="h-4 w-4" />
              {t("work.role")}: {pick(project.role)}
            </span>
          )}
        </div>

        <p className="mt-6 text-[15px] leading-[2] text-txt/85">
          {service ? pick(service.body) : project ? pick(project.blurb) : ""}
        </p>

        {service && (
          <>
            <h4 className="mt-7 font-display text-[15px] font-bold text-txt">{t("services.includes")}</h4>
            <ul className="mt-3 grid gap-2.5 sm:grid-cols-2">
              {service.features.map((f) => (
                <li
                  key={f.en}
                  className="flex items-start gap-3 rounded-2xl border border-white/8 bg-white/[0.03] px-4 py-3 transition hover:border-[var(--color-accent)]/40"
                >
                  <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full" style={{ background: `${color}22`, color }}>
                    <Icon name="check" className="h-3.5 w-3.5" strokeWidth={2.4} />
                  </span>
                  <span className="text-[13.5px] leading-relaxed text-txt/90">{pick(f)}</span>
                </li>
              ))}
            </ul>
          </>
        )}

        {project && (
          <>
            <h4 className="mt-7 font-display text-[15px] font-bold text-txt">{t("work.highlights")}</h4>
            <ul className="mt-3 grid gap-2.5 sm:grid-cols-3">
              {project.highlights.map((h) => (
                <li key={h.en} className="rounded-2xl border border-white/8 bg-white/[0.03] px-4 py-3 text-[13px] leading-relaxed text-txt/90">
                  <Icon name="spark" className="mb-2 h-4 w-4" style={{ color }} />
                  {pick(h)}
                </li>
              ))}
            </ul>
            <div className="mt-5 grid grid-cols-2 gap-3">
              {project.metrics.map((m) => (
                <div key={m.label.en} className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                  <div className="font-display text-3xl font-bold" style={{ color }}>
                    {fmt(m.v)}
                    <span className="text-base">{m.suffix}</span>
                  </div>
                  <div className="mt-1 text-[12px] text-muted">{pick(m.label)}</div>
                </div>
              ))}
            </div>
          </>
        )}

        <h4 className="mt-7 font-display text-[15px] font-bold text-txt">{t("services.stack")}</h4>
        <div className="mt-3 flex flex-wrap gap-2">
          {(service?.stack ?? project?.stack ?? []).map((s) => (
            <Chip key={s} color={color}>
              {s}
            </Chip>
          ))}
        </div>

        <div className="mt-8 flex flex-wrap items-center gap-3 border-t border-white/10 pt-6">
          <Btn onClick={() => startProject(service?.id ?? project?.serviceId ?? "web-shop")}>
            <Icon name="rocket" className="h-4 w-4" />
            {t("services.order")}
          </Btn>
          {project && (
            <Btn variant="outline" onClick={() => requestSimilar(`${pick(project.name)} — ${t("work.request")}`)}>
              <Icon name="send" className="h-4 w-4" />
              {t("work.request")}
            </Btn>
          )}
          <Btn
            variant="ghost"
            onClick={() => {
              closeDetail();
              askBot(`${t("chat.q.price")} — ${title}`);
            }}
          >
            <Icon name="chat" className="h-4 w-4" />
            {t("chat.open")}
          </Btn>
          {related && (
            <button
              type="button"
              onClick={() => openDetail("project", related.id)}
              className="inline-flex items-center gap-2 text-[13px] font-semibold text-muted transition hover:text-[var(--color-accent)]"
            >
              <Icon name="layers" className="h-4 w-4" />
              {t("wiz.match")}: {pick(related.name)}
              <Icon name="arrow" className="h-4 w-4 rtl:rotate-180" />
            </button>
          )}
          {relatedService && (
            <button
              type="button"
              onClick={() => openDetail("service", relatedService.id)}
              className="inline-flex items-center gap-2 text-[13px] font-semibold text-muted transition hover:text-[var(--color-accent)]"
            >
              <Icon name="grid" className="h-4 w-4" />
              {pick(relatedService.title)}
              <Icon name="arrow" className="h-4 w-4 rtl:rotate-180" />
            </button>
          )}
        </div>
      </div>
    </Modal>
  );
}