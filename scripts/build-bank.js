/**
 * Собирает все JSON-файлы из seed-data/ в один файл dist/oge_bank.json,
 * который потом просто загружается в GitHub-репозиторий, требуется только Node.js
 *
 * Запуск скрипта выполняется из корня проекта в командной строке:
 *   node scripts/build-bank.js
 *
 * Каждый запуск увеличивает версию банка на 1 (хранится в version.txt)
 * именно по этому номеру версии приложение определяет, что появилось
 * обновление (см. BankSyncRepository.checkForUpdates в Android-проекте).
 */
const fs = require("fs");
const path = require("path");

const seedDir = path.join(__dirname, "..", "seed-data");
const distDir = path.join(__dirname, "..", "dist");
const versionFile = path.join(__dirname, "..", "version.txt");

function readJson(fileName) {
  return JSON.parse(fs.readFileSync(path.join(seedDir, fileName), "utf-8"));
}

const subjects = readJson("subjects.json");
const topics = readJson("topics.json");
// questionFiles: Обновлять при добавлении новых предметов с вопросами к ним
const questionFiles = ["questions_math_oge.json", "questions_rus_oge.json", "questions_phys_oge.json"];
const questions = questionFiles.flatMap((file) => readJson(file));
const theory = readJson("theory.json");

let version = 1;
if (fs.existsSync(versionFile)) {
  version = parseInt(fs.readFileSync(versionFile, "utf-8").trim(), 10) + 1;
}
fs.writeFileSync(versionFile, String(version));

const bank = {
  version,
  generatedAt: new Date().toISOString(),
  subjects,
  topics,
  questions,
  theory
};

if (!fs.existsSync(distDir)) fs.mkdirSync(distDir, { recursive: true });
fs.writeFileSync(path.join(distDir, "oge_bank.json"), JSON.stringify(bank, null, 2));

console.log(`oge_bank.json собран, версия ${version}`);
console.log(`Предметов: ${subjects.length}, тем: ${topics.length}, заданий: ${questions.length}, статей теории: ${theory.length}`);
console.log(`Не забуть закоммитить и запушить в GitHub.`);
