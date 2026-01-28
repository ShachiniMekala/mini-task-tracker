<?php

namespace App\EventSubscriber;

use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Event\ExceptionEvent;
use Symfony\Component\HttpKernel\Exception\HttpExceptionInterface;
use Symfony\Component\HttpKernel\KernelEvents;

class ApiExceptionSubscriber implements EventSubscriberInterface
{
    public static function getSubscribedEvents(): array
    {
        return [
            KernelEvents::EXCEPTION => 'onKernelException',
        ];
    }

    public function onKernelException(ExceptionEvent $event): void
    {
        $exception = $event->getThrowable();
        
        // Standardize the error response
        $response = new JsonResponse();
        $data = [
            'error' => $exception->getMessage(),
        ];

        if ($exception instanceof HttpExceptionInterface) {
            $response->setStatusCode($exception->getStatusCode());
            $response->headers->replace($exception->getHeaders());
            $data['error'] = $exception->getMessage();
        } else {
            $response->setStatusCode(Response::HTTP_INTERNAL_SERVER_ERROR);
            // Include the real message for easier debugging during development
            $data['error'] = $exception->getMessage();
            $data['trace'] = $exception->getTraceAsString();
        }

        $response->setData($data);
        $event->setResponse($response);
    }
}

